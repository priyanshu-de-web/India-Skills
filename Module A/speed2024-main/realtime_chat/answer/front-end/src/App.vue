<script setup>
import {reactive, ref} from "vue";
import {io} from "socket.io-client";
import {SOCKET_HOST} from "@/config";

const messages = reactive([]);
const id = ref(null);
const socket = ref(null);
const messageContent = ref("");

const submitMessage = () => {
    socket.value.emit("submitMessage", id.value, messageContent.value);
    messageContent.value = "";
}

const receiveMessage = data => {
    messages.push(data);
    console.log(data.user_id);
}
const connectSocket = () => {
    socket.value = io(SOCKET_HOST);

    socket.value.on("successConnect", (user_id) => {
        id.value = user_id;
        console.log(id.value);
    });
    socket.value.on("receiveMessage", receiveMessage);
}
connectSocket();

</script>

<template>
    <div id="container">
        <div class="message-container">
            <div class="message-box">
                <div class="message-wrapper">

                    <template v-for="message in messages">
                        <div class="message-item" :class="{my: message.user_id === id}">
                            <div class="message-content">{{message.content}}</div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
        <form class="input-box" @submit.prevent="submitMessage">
            <input type="text" class="input-control" v-model="messageContent">
            <button>Submit</button>
        </form>
    </div>
</template>

<style scoped>

</style>
