<template>
    <div class="page-title">
            <h1>
                <i v-if="icon" :class="icon"></i>{{ main }} 
            </h1>
        <hr>
    </div>
</template>

<script>

export default {
    name: 'PageTitle',
    props: {
        icon: String, 
        main: String, 
        sub: String
    }
}

</script>

<style scoped>
    .page-title {
        display: flex;
        flex-direction: column;
    }


    .page-title i{
        padding-right: 0.4rem;
    }


    .page-title h2{
        padding-top: 2px;
        color: #777;
        margin-top: 0px;
        font-size: 1.3rem;
    }

    hr {
        margin-top: 7px;
        padding-bottom: 10px;
    }
</style>