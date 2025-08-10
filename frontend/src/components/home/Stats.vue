<template>
    <div class="stats">
        <div class="stats-icon">
            <i :class="icon" :style="style"></i>
        </div>
        <div class="stats-info">
            <span class="stats-title">{{ title }}</span>
            <span class="stats-value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stats',
    props: ['title', 'value', 'icon', 'color'],
    computed: {
        style() {
            return "color: " + (this.color || "#000")
        }
    }
}
</script>

<style scoped>
    .stats {
        flex: 1;
        display: flex;
        border-radius: 8px;
        margin-right: 20px;
        margin-bottom: 20px;
        background-color: #fff;
        padding: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }

    .stats-icon {
        display: flex;
        align-items: center;
        padding: 0.4rem 0px 0rem 1.1rem;
    }

    .stats-icon i {
        font-size: 4.6rem;
    }

    .stats-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .stats-info span{
        padding-right: 1.1rem;
        font-weight: bold;
    }

    .stats-title {
        font-size: 1.2rem;
    }

    .stats-value {
        font-size: 3rem;
    }
</style>