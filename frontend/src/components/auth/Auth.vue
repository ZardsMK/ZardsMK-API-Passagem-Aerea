<template>
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/mack.png" alt="">
            <hr>
            <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login'}}</div>

            <input v-if="showSignup" v-model="user.name" type="text" placeholder="Nome">
            <input v-model="user.email" type="text" placeholder="E-mail">
            <input v-model="user.password" type="password" placeholder="Senha">
            <input v-if="showSignup" v-model="user.confirmPassword" 
                type="password" placeholder="Confirmar a Senha">

            <button @click="submit">{{ showSignup ? 'Registrar' : 'Entrar' }}</button>

            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Já tem cadastro? Acesse o Login!</span>
                <span v-else>Não tem cadastro? Registre-se aqui!</span>
            </a>
        </div>
    </div>
</template>

<script>
import { axiosInstance } from "../../config/axios"
import { userKey } from '../../global';
import { showSuccess, showError } from '../../config/msgs';

export default {
    name: 'Auth',
    data() {
        return {
            showSignup: false,
            user: {}
        }
    },
    methods: {
        signin() {
            axiosInstance.post(`/signin`, this.user)
            .then(res => {
                this.$store.commit('setUser', res.data);
                localStorage.setItem(userKey, JSON.stringify(res.data));
                this.$router.push({ path: '/' });
                showSuccess(`Login realizado com sucesso!`);
            })
            .catch(e => showError(e.response?.data));
        },
        signup() {
            axiosInstance.post(`/signup`, this.user)
                .then(() => {
                    showSuccess('Cadastro realizado com sucesso!');
                    this.user = {};
                    this.showSignup = false;
                })
                .catch(e => showError(e.response?.data))
        },
        submit() {
            this.showSignup ? this.signup() : this.signin();
        }
    }
}

</script>

<style>
    .auth-content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        border-radius: 5px;
    }

    input {
        border-radius: 5px;
    }

    .auth-modal {
        background-color: #fff;
        width: 350px;
        padding: 35px;
        box-shadow: 0 1px 5 px rgb(0, 0, 0, 0.1);

        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
    }

    .auth-title {
        font-size: 1.2rem;
        font-weight: 400;
        margin-top: 10px;
        margin-bottom: 15px;
        color: #000000;
    }

    .auth-modal input {
        border: 1px solid #BBB;
        width: 100%;
        margin-bottom: 15px;
        padding: 3px 8px;
        outline: none;
    }

    .auth-modal button {
        align-self: flex-end;
        background-color: #3f2b96;
        color: #FFF;
        padding: 5px 15px;
    }

    .auth-modal button:hover {
        background-color: #7f7bf7;
        color: #000000;
    }

    .auth-modal a {
        margin-top: 35px;
    }

    .auth-modal hr {
        border: 0;
        width: 100%;
        height: 1;
        background-image: linear-gradient(to right, 
            rgba(120, 120, 120, 0), 
            rgba(120, 120, 120, 0.75),
            rgba(120, 120, 120, 0)
            );
    }

    img {
        height: 8.8rem;
        width: 8.8rem;
    }
</style>