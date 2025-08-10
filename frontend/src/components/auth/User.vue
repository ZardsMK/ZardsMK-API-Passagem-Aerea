<template>
    <div class="user">
        <h1>
            <i class="fa fa-home"></i> Bem vindo, {{getUser.name}}
        </h1>
        <hr>
        <div class="tab-buttons">
            <button
                v-for="tab in tabs"
                    :key="tab.name"
                    :class="{ active: activeTab === tab.name }"
                    @click="activeTab = tab.name"
                >
                {{ tab.label }}
            </button>
        </div>
        
        <div v-if="activeTab === 'tab1'" class="tab-content">
          <h2>Voos pagos futuros</h2>

          <div class="cards-container">
            <div 
              v-for="r in voosFuturosPagos" 
              :key="r.id" 
              class="card"
            >
              <p><strong>Origem:</strong> {{ r.flight?.origin || '-' }}</p>
              <p><strong>Destino:</strong> {{ r.flight?.destination || '-' }}</p>
              <p><strong>Data:</strong> {{ formatDate(r.flight?.arrival_time) }}</p>
            </div>
            <div v-if="voosFuturosPagos.length === 0" class="empty-msg">
              Nenhum voo futuro pago.
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'tab2'" class="tab-content">
          <h2 class="text-xl font-bold mb-4">Passagens Pendentes</h2>

            <div v-if="selected.length > 0" class="mb-4">
              <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="pagarSelecionadas">
                Pagar Selecionadas ({{ selected.length }})
              </button>
            </div>

            <div class="grid gap-4">
              <div 
                v-for="reserva in pendingReservations" 
                :key="reserva.id" 
                class="border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p><strong>Origem:</strong> {{ reserva.flight?.origin || '-' }}</p>
                  <p><strong>Destino:</strong> {{ reserva.flight?.destination || '-' }}</p>
                  <p><strong>Data:</strong> {{ formatDate(reserva?.expires_at) }}</p>
                  <p><strong>Valor:</strong> {{ reserva.total_amount }}</p>
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    :value="reserva.reservation_id" 
                    v-model="selected"
                  />
                  <p>Selecionar</p>
                </div>
              </div>
              <div v-if="pendingReservations.length === 0">Nenhuma passagem pendente.</div>
            </div>
        </div>

        <div v-if="activeTab === 'tab3'" class="tab-content">
          <h2>Histórico de voos</h2>

          <div class="cards-container">
            <div 
              v-for="r in historicoVoos" 
              :key="r.id" 
              class="card"
            >
              <p><strong>Origem:</strong> {{ r.flight?.origin || '-' }}</p>
              <p><strong>Destino:</strong> {{ r.flight?.destination || '-' }}</p>
              <p><strong>Data:</strong> {{ formatDate(r.flight?.departure_time) }}</p>
            </div>
            <div v-if="historicoVoos.length === 0" class="empty-msg">
              Nenhum voo passado encontrado.
            </div>
          </div>
        </div>

    </div>
</template>

<script>
import { axiosInstance } from '../../config/axios';
import { showError } from '../../config/msgs';

export default {
    name: 'User',
    components: {},
    data() {
      return {
          activeTab: 'tab1',
          reservas: [],
          user: {},
          selected: [],
          pendingReservations: [],
          tabs: [
              { name: 'tab1', label: 'Voos', content: '' },
              { name: 'tab2', label: 'Passagens', content: '' },
              { name: 'tab3', label: 'Histórico', content: '' },
              ],
          };
    },
    mounted() {
        this.setInitialTab();
      },
      created() {
        this.setInitialTab();
        this.fetchReservas();
      },
      methods: {
        setInitialTab() {
          const queryTab = this.$route.query.tab;
          if (this.tabs.some(t => t.name === queryTab)) {
            this.activeTab = queryTab;
          }
        }, 
        async fetchReservas() {
          try {
            const response = await axiosInstance.get(`/payments/reservation/${this.$store.state.user.id}`);
            const reservas = response.data;

            const promises = reservas.map(async reserva => {
              try {
                const flightResp = await axiosInstance.get(`/flights/${reserva.flight_id}`);
                return {
                  ...reserva,
                  flight: flightResp.data,
                };
              } catch (err) {
                return { ...reserva, flight: null };
              }
            });

            this.reservas = await Promise.all(promises);
            await this.fetchPendingFlights();
          } catch (err) {
            showError(`Erro ao buscar reservas: ${err}`);
          }
        },
        async fetchPendingFlights() {
          
          const pendentes = this.reservas.filter(r => r.status === 'pendente');
          const promises = pendentes.map(async reserva => {
            try {
              const flightResp = await axiosInstance.get(`/flights/${reserva.flight_id}`);
              return {  
                ...reserva,
                flight: flightResp.data,
              };
            } catch (err) {
              return { ...reserva, flight: null };
            }
          });
          this.pendingReservations = await Promise.all(promises);
        },
        toggleSelection(id) {
          const idx = this.selected.indexOf(id);
          if (idx === -1) {
            this.selected.push(id);
          } else {
            this.selected.splice(idx, 1);
          }
        },
        pagarSelecionadas() {
          const ids = this.selected.join(',')
          this.$router.push({ path: '/payment', query: { ids } })
        },
        formatDate(data) {
          const d = new Date(data)
          return d.toLocaleDateString('pt-BR')
        }
    },
    watch: {
        '$route.query.tab'(newTab) {
          if (this.tabs.some(t => t.name === newTab)) {
            this.activeTab = newTab;
          }
        }
      },
    computed: {
        getUser() {
            return this.$store.state.user || { name: "Visitante" };
        },
        historicoVoos() {
          const hoje = new Date();
          return this.reservas.filter(r =>
            r.status === 'pago' && new Date(r.flight.departure_time) < hoje
          );
        },
        voosFuturosPagos() {
          const hoje = new Date();
          return this.reservas.filter(r =>
            r.status === 'pago' && new Date(r.flight.departure_time) > hoje
          );
        },
        passagensPendentes() {
          return this.reservas.filter(r => r.status === 'pendente');
        }
      }
}
</script>


<style scoped>
.tabs {
  width: 100%;
}

.tab-buttons {
  display: flex;
  justify-content: left;
  margin-bottom: 0px;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #a8c0ff;
  transition: background-color 0.3s;
}

button.active {
  background-color: rgb(63, 43, 150);
  color: #fff;
}

.tab-button:not(:last-child) {
  border-right: none;
}

button:first-child {
  border-radius: 20px 0 0 0;
}

button:last-child {
  border-radius: 0 20px 0 0;
}

button:not(:first-child):not(:last-child) {
  border-radius: 0;
}

button:hover {
  background-color: #795ec4;
  color: #fff;
}

.tab-content {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 0 5px 5px 5px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 10px;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card p {
  margin: 4px 0;
}

.empty-msg {
  grid-column: 1 / -1;
  text-align: center;
  color: #888;
  padding: 20px;
}

</style> 