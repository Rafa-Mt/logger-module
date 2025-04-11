<template>
    <div class="card flex justify-center" @click="toggle($event)" style="font-family: Arial, sans-serif;">
        <i class="pi pi-folder-open"></i> Backup        
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="font-family: Arial, sans-serif;" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menu from "primevue/menu";

const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Import',
                icon: 'pi pi-download',
                command: () => {
                    // Handle import action
                    console.log('Import action triggered');
                }
            },
            {
                label: 'Export',
                icon: 'pi pi-upload',
                command: () => {
                    // Handle export action
                    console.log('Export action triggered');
                }
            }
        ]
    }
]);

const toggle = (event: Event) => {
    menu.value?.show(event);
};
</script>