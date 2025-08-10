<template>
    <div class="user-dropdown">
        <div class="user-button">
            <span class="d-none d-sm-block">{{ user.name || 'Visitante' }}</span>
            <div class="user-dropdown-img">
                <Gravatar :email="user.email || ''" alt="user"/>
            </div>
            <i class="fa fa-angle-down"></i>
        </div>
        <div class="user-dropdown-content">
            <template v-if="isLoggedIn">
                <router-link to="/user">
                    <i class="fa fa-user"></i> Usúario
                </router-link>
                <router-link to="/logout">
                    <i class="fa fa-sign-out"></i> Sair
                </router-link>
            </template>
            <template v-else>
                <router-link to="/auth">
                    <i class="fa fa-user"></i> Login
                </router-link>
            </template>
        </div>
    </div>
</template>

<script>

import Gravatar from 'vue3-gravatar'
export default {
    name: 'UserDropdown',
    components: { Gravatar },
    computed: {
        isLoggedIn() {
            return this.$store.state.user && this.$store.state.user.token;
        },
        user() {
            return this.$store.state.user && this.$store.state.user.name ? this.$store.state.user : {};
        }
    }
}
</script>

<style>
    .user-dropdown {
        position: relative;
        height: 100%;
        
    }

    .user-button {
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 100;
        height: 100%;
        padding: 0px 20px;

    }

    .user-dropdown:hover {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }

    .user-dropdown-img {
        margin: 0px 10px;
    }

    .user-dropdown-img > img {
        max-height: 37px;
        border-radius: 5px;
    }

    .user-dropdown-content {
        position: absolute;
        right: 0px;
        background-color: #f9f9f9;
        min-width: 170px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2); 
        padding: 10px;
        z-index: 1;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.5s linear;
    }

    .user-dropdown:hover .user-dropdown-content {
        visibility: visible;
        opacity: 1;
        border-radius: 5px;
    }

    .user-dropdown-content a {
        text-decoration: none;
        color: #000;
        padding: 10px;
    }

    .user-dropdown-content a:hover {
        text-decoration: none;
        color: #000;
        background-color: #EDEDED;
        border-radius: 5px;
    }
</style>