<template>
    <header class="header">
        <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
            <i class="fa fa-lg" :class="icon"></i>
        </a>
        <h1 class="title">
                <router-link to="/">{{ title }}</router-link>
        </h1>
         <UserDropdown v-if="!hideUserDropdown"/>
    </header>
</template>

<script>
    import UserDropdown from './UserDropdown.vue';

    export default {
        name: 'Header',
        components: { UserDropdown },
        props: {
            title: String,
            hideToggle: Boolean,
            hideUserDropdown: Boolean
        },
        computed: {
            icon() {
                return this.$store.state.isMenuVisible ? "fa-angle-left" : "fa-angle-down";       
            }
        },
        methods: {
            toggleMenu() {
                this.$store.commit('toggleMenu');
            }
        }
    }
</script>

<style>
    .header {
        display: grid;
        grid-area: header;
        background: linear-gradient(to right,  #a8c0ff, #3f2b96);
        height: 60px;
        display: flex;
        align-items: center;
        padding:10px;
    }
    

    .title {
        font-size: 1.2rem;
        color: #fff;
        font-weight: 100;
        flex-grow: 1;
        text-align: center;
    }

    .title a {
        color: inherit; 
        text-decoration: none;
    }


	header.header > a.toggle {
		width: 60px;
		height: 100%;
		color: #fff;
		justify-content: flex-start;
		text-decoration: none;

        display: flex;
        justify-content: center;
        align-items: center;
	}

    header.header > a.toggle:hover {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }
</style>