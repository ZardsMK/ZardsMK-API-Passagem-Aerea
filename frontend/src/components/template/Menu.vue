<template>
    <aside class="menu" :class="{ visible: !isMenuVisible }">
        <nav>
            <ul>
                <router-link to="/"><li>Início</li></router-link>
                <router-link to="/offers"><li>Ofertas</li></router-link>
                <router-link to="/flights"><li>Voos</li></router-link>
            </ul>
        </nav>
    </aside>
</template>

<script>
import { mapState } from 'vuex' 
export default {
    name: "Menu",
    computed: mapState(['isMenuVisible'])
}
</script>

<style scoped>
    .menu {
        grid-area: menu;
        background: linear-gradient(to right, #232526, #414345);
        width: 250px;
        height: calc(100vh - 60px);
        position: fixed;
        top: 60px;
        left: 0;
        opacity: 0;
        visibility: hidden;
        transform: translateX(-100%);
    }

    .menu.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
    }

    .menu nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .menu nav ul li {
        margin: 5px 5px;
        padding: 20px;
    }

    .menu nav ul li:hover {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
    }

    .menu nav li {
        margin: 20px;
    }

    .menu nav a {
        color: #fff;
        text-decoration: none;
        font-size: 1.2rem;
    }

    .menu nav a:hover {
        text-decoration: underline;
    }
</style>