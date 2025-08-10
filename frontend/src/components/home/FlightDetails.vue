<template>
    <div class="container mt-4" v-if="voo">
        <b-button variant="secondary" class="mb-3" @click="$router.back()"> Voltar</b-button>

        <h2>Detalhes do Voo</h2>
        <b-card class="mt-3">
            <h4>{{ voo.origem }} → {{ voo.destino }}</h4>
            <p><strong>Data:</strong> {{ voo.data }}</p>
            <p><strong>Hora:</strong> {{ voo.hora }}</p>
            <p><strong>Assentos disponíveis:</strong> {{ voo.assentosDisponiveis }}</p>
        </b-card>

        <div class="mt-4">
            <h5>Mapa de Assentos</h5>
            <div class="d-flex flex-wrap" style="max-width: 320px;">
                <div
                    v-for="assento in voo.assentos"
                    :key="assento.numero"
                    class="assento m-1 p-2 text-center"
                    :class="{
                          reservado: assento.status === 'reservado',
                          comprado: assento.status === 'comprado',
                          disponivel: assento.status === 'livre',
                          ocupado: assento.status === 'indisponivel',
                          selecionado: reservas.includes(assento.numero)
                    }"
                    @click="toggleReserva(assento)"
                    >
                    {{ assento.numero }}
                </div>
            </div>
            <div class="mt-3">
                <p><strong>Reservas:</strong> {{ reservas.join(', ') || 'Nenhuma' }}</p>
                <p><strong>Total:</strong> R$ {{ reservas.length * precoAssento }},00</p>
                <b-button variant="success" :disabled="reservas.length === 0" @click="finalizarCompra">
                Reservar
                </b-button>
            </div>
            <small class="d-block mt-2">
                <span class="legend ocupado"></span> Ocupado
                <span class="legend disponivel ms-3"></span> Disponível
                <span class="legend reservado ms-3"></span> Reservado
                <span class="legend comprado ms-3"></span> Comprado
            </small>
        </div>
    </div>

    <b-alert variant="danger" show v-else class="m-4">
        Voo não encontrado.
    </b-alert>
</template>
  
<script>
import { axiosInstance } from '../../config/axios';
import { showError } from '../../config/msgs';

export default {
    name: 'FlightDetails',
    data() {
        return {
            voo: null,
            reservas: [],
            precoAssento: 200,
            reservaData: {}
        };
    },
    async mounted() {
        try {
          const vooResponse = await axiosInstance.get(`/flights/${this.$route.params.id}`);
          const vooData = vooResponse.data;

          const assentosDoBanco = (await axiosInstance.get(`/seats/${this.$route.params.id}`)).data;

          this.voo = {
            id: vooData.flight_id,
            origem: vooData.origin,
            destino: vooData.destination,
            data: vooData.departure_time.split('T')[0],
            hora: vooData.departure_time.split('T')[1].slice(0, 5),
            assentosDisponiveis: vooData.available_seats,
            assentos: await this.gerarAssentos(vooData.available_seats, assentosDoBanco)
          };

        } catch (err) {
          showError(err.response?.data);
        }
    },

    methods: {
      async gerarAssentos(qtd, assentosBanco) {
        const assentos = await Promise.all(
          Array.from({ length: qtd }, async (_, i) => {
            const numero = String(i + 1).padStart(2, '0');
            const db = assentosBanco.find(s => s.seat_number === numero);

            if (!db) return { numero, status: 'livre' };
            if (db.status === 'comprado') return { numero, status: 'comprado' };

            if (db.status === 'reservado') {
              try {
                const { data: seatReservation } = await axiosInstance.get(`/seats/reservation/${db.seat_id}`);
                const { data: reserva } = await axiosInstance.get(`/reservations/${seatReservation.reservation_id}`);

                return {
                  numero,
                  status: reserva.user_id === this.$store.state.user?.id ? 'reservado' : 'indisponivel'
                };
              } catch (err) {
                showError(`Erro ao buscar reserva do assento ${numero}.`);
                return { numero, status: 'indisponivel' };
              }
            }

            return { numero, status: 'livre' };
          })
        );

        return assentos;
      },
      toggleReserva(assento) {
          if (assento.status === 'livre') {
            const index = this.reservas.indexOf(assento.numero);
            if (index === -1) {
              this.reservas.push(assento.numero);
            } else {
              this.reservas.splice(index, 1);
            }
          }
      },
      async finalizarCompra() {

        const user = this.$store.state.user;
        if (!user?.id) {
          showError("Faça login para comprar a passagem.");
          return;
        }

        const reservaPayload = {
          flight_id:  this.voo.id,
          user_id:    user.id,
          status:     "pendente",
          reserved_at: new Date().toISOString(),
          expires_at:  new Date(Date.now() + 2*24*60*60*1000).toISOString(),
          total_amount: this.reservas.length * this.precoAssento
        };

        const response =  await axiosInstance.post('/reservations', reservaPayload);
        const { reservation_id  } = response.data.obj

        const responseRP = await axiosInstance.post('/reservation_passengers', {
            reservation_id,
            passenger_name: user.name,
            phone: "none"
        });

        const { id } = responseRP.data.obj

        await axiosInstance.post('/payments', {
          reservation_id,
          amount: reservaPayload.total_amount,
          payment_method: 'none',     
          payment_status: 'pendente'
        });

        for (let numero of this.reservas) {
          const responseS = await axiosInstance.post('/seats', {
            flight_id: this.voo.id,
            seat_number: numero.toString().padStart(2,'0'),
            status: 'reservado'
          });

          const { seat_id } = responseS.data.obj

          await axiosInstance.post('/reservation_seats', {
            reservation_id,
            seat_id,
            passenger_id: id
          });
        }
            
        this.voo.assentosDisponiveis -= this.reservas.length;
        this.reservas = [];

        this.$router.push({ path: "/user", query: { tab: 'tab2' }});
      }
  }
};
</script>

<style scoped>
.assento {
  width: 40px;
  height: 40px;
  line-height: 36px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: default;
}
.selecionado {
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #0d6efd;
}
.ocupado {
  background-color: #dc3545; 
  color: white;
}
.disponivel {
  background-color: #0d6efd;
  color: white;
  cursor: pointer;
}
.reservado {
  background-color: #ffc107;
  color: black;
  cursor: pointer;
}
.comprado {
  background-color: #198754; 
  color: white;
}
.legend {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
}
.legend.ocupado {
  background-color: #dc3545;
}
.legend.disponivel {
  background-color: #0d6efd;
}
.legend.reservado {
  background-color: #ffc107;
}
.legend.comprado {
  background-color: #198754;
}
</style>