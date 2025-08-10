<template>
  <div class="payment-page">
    <h2>Confirmação de Pagamento</h2>

    <div v-if="reservas.length === 0">
      <p>Nenhuma reserva selecionada para pagamento.</p>
    </div>

    <div v-else>
      <ul>
        <li v-for="reserva in reservas" :key="reserva.reservation_id">
          <strong>Reserva #{{ reserva.reservation_id }}</strong><br />
          Valor: R$ {{ reserva.pay?.amount || '-' }}
        </li>
      </ul>

      <div class="total">
        <p><strong>Total:</strong> R$ {{ valorTotal }}</p>
      </div>

      <div class="pagamento">
        <label>Forma de Pagamento:</label>
        <select v-model="formaPagamento">
          <option disabled value="">Selecione</option>
          <option value="pix">Pix</option>
          <option value="cartao">Cartão</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      <button @click="pagar">Confirmar Pagamento</button>
    </div>
  </div>
</template>

<script>
import { axiosInstance } from '../../config/axios';
import { showError, showSuccess } from '../../config/msgs';

export default {
  name: 'Payment',
  data() {
    return {
      reservas: [],
      formaPagamento: ''
    };
  },
  computed: {
    valorTotal() {
      return this.reservas.reduce((total, reserva) => {
        const valor = reserva.pay?.amount || 0;
        
        return total + parseInt(valor);
      }, 0).toFixed(2);
    }
  },
  async created() {
    const params = new URLSearchParams(this.$route.query);
    const ids = params.get('ids');

    if (ids) {
      const idArray = ids
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      const promises = idArray.map(async id => {
        try {
          const reservaRes = await axiosInstance.get(`/reservations/${id}`);
          const reserva = reservaRes.data;

          const payRes = await axiosInstance.get(`/payments/pay/${reserva.reservation_id}`);
          reserva.pay = payRes.data;

          return reserva;
        } catch (error) {
          showError(`Erro ao carregar reserva ${id}.`);
          return null;
        }
      });

      const resultados = await Promise.all(promises);
      this.reservas = resultados.filter(r => r !== null);
    }
  },
  methods: {
    async pagar() {
      if (!this.formaPagamento) {
        showError("Selecione uma forma de pagamento.");
        return;
      }

      try {
        for (const reserva of this.reservas) {

          await axiosInstance.put(`/reservations/${reserva.reservation_id}`, {
            user_id: reserva.user_id,
            flight_id: reserva.flight_id,
            reserved_at: reserva.reserved_at,
            expires_at: reserva.expires_at,
            total_amount: reserva.total_amount,
            status: 'pago'
          });

          await axiosInstance.put(`/payments/${reserva.pay.payment_id}`, {
            amount: reserva.pay.amount,
            reservation_id: reserva.reservation_id,
            payment_status: 'confirmado',
            payment_method: this.formaPagamento,
          });
        }

        showSuccess('Pagamento realizado com sucesso!');
        
        setTimeout(() => {
            this.$router.push({ path: '/user', query: { tab: 'tab1' } });
        }, 1000)
      } catch (error) {
        showError("Erro ao processar o pagamento.");
      }
    }
  }
};
</script>

<style scoped>
.payment-page {
  max-width: 600px;
  margin: 0 auto;
}
ul {
  padding: 0;
}
li {
  margin-bottom: 1em;
  list-style: none;
  padding: 10px;
  border: 1px solid #ddd;
}
.total {
  margin: 20px 0;
  font-size: 1.1em;
}
.pagamento {
  margin-bottom: 20px;
}
select {
  margin-top: 8px;
  padding: 6px;
  width: 100%;
}
button {
  padding: 10px 20px;
  font-weight: bold;
}
</style>
