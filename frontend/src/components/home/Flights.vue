<template>
    <div class="flights">
        <div>
            <PageTitle icon="fa fa-plane" main="Voos" sub="Voos de hoje"></PageTitle>
        </div>
        <div class="flight-content">
            <div class="card" v-for="flight in flights" :key="flight.id">
                <router-link :to="`/flights/${flight.flight_id}`">
                    <div class="flight-details">
                        <div class="flight-title">
                            <h3>{{ flight.origin }}</h3> → <h3>{{ flight.destination }}</h3>
                        </div>
                        <p> <strong>Saida:</strong> {{ formatarData(flight.departure_time) }}</p>
                        <p><strong>Assentos:</strong> {{ flight.available_seats }}</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue"
import { axiosInstance } from "../../config/axios"
import { showError } from "../../config/msgs";

export default {
    name: 'Flights',
    components: {PageTitle},
    data() {
        return {
            responseData: null,
            flights: [],
        };
    },
    methods: {
        async fetchData() {
            try {
                const resp = await axiosInstance.get(`/flights`);
                this.flights = resp.data;
            } catch (err) {
                showError('Erro ao buscar dados.');
            }
        },
        formatarData(dataIso) {
            const data = new Date(dataIso);
            return data.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    }, 
    mounted() {
        this.fetchData();
    }
}
</script>


<style scoped>



.flight-content {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    background-color: #7763d1;
    justify-content: center;
    padding: 10px 0;
    border-radius: 10px;
}

.flight-content .card {
    flex: 1 1 300px; 
    max-width: 320px;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.flight-title {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0px 5rem;
    gap: 10px;
}

a {
    text-decoration: none;
}

.card {
  width: calc(50% - 20px);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.card p {
  margin: 10px 0;
  font-size: 0.9rem;
  color: #555;
}

</style> 