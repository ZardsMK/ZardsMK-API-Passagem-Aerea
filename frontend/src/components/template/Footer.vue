<template>
    <footer class="footer">
        <span class="no-text">
            <meta URL="https://www.cod3r.com.br/"> Agradecimento a <strong>Cod3r</strong> 2024 </meta>
        </span>
    </footer>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style>
    .footer {
        grid-area: footer;
        background-color: #DDD;
        color: #333;
        
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
    }

    footer.footer > span.no-text{
        text-decoration: none;
    }
</style>