<template>
	<div class="app" :class="{'hide-menu': isMenuVisible}">
		<Header v-if="shouldShowMenu"
			title="SabrinaAir" :hideToggle="false"
			:hideUserDropdown="false"
		></Header>
		<Header v-else
			title="SabrinaAir" :hideToggle="true"
			:hideUserDropdown="true" 
		></Header>
		<Menu v-if="shouldShowMenu"></Menu>
		<Content></Content>
		<Footer></Footer>
	</div>
</template>

<script>

import { mapState } from 'vuex'
import Header from '@/components/template/Header.vue';
import Menu from '@/components/template/Menu.vue';
import Footer from '@/components/template/Footer.vue';
import Content from '@/components/template/Content.vue';
import '@fortawesome/fontawesome-free/css/all.css';


export default {
	name: "App",
	components: { Header, Menu, Content, Footer },
	computed: {
		...mapState(['isMenuVisible']),
		shouldShowMenu() {
			return this.$route.meta.showMenu;
		}
	}
}
</script>

<style>
	body {
		margin: 0;
	}
	.app {
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns:  250px 1fr;
		height: 100vh;
		grid-template-areas: 
			"header header" 
			"menu content" 
			"menu footer";
			background: linear-gradient(to right, #232526, #414345);
	}

	.app.hide-menu {
		grid-template-columns: 1fr;
		grid-template-areas: 
		"header header" 
		"content content" 
		"footer footer";
		background: linear-gradient(to right, #232526, #414345);
	}

</style>