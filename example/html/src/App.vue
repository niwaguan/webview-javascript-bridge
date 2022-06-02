<template>
  <div>
    <p>userAgent: {{ state.userAgent }}</p>
    <p><button @click="callNative">Send message</button></p>
    <p>
      <button @click="callNativeWithParams">
        Send message with params
      </button>
    </p>
    <p>
      <button @click="callNativeWithParamsAndResponse">
        Send message with param and callback
      </button>
    </p>
    <p>
      <button @click="callNativeCrazy">crazy Send message</button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue-demi";
import webViewJavaScriptBridge from "webview-javascript-bridge";

const state = reactive({
  userAgent: "",
  cookie: "",
});

function callNative() {
  webViewJavaScriptBridge.sendMessage({ action: "tester" });
}
function callNativeWithParams() {
  webViewJavaScriptBridge.sendMessage({
    action: "tester",
    params: 123,
  });
}
async function callNativeWithParamsAndResponse() {
  let response = await webViewJavaScriptBridge
    .sendMessage<number>({
      action: "tester",
      params: 123456,
    })
  console.log("tester's response", response);
}
function callNativeCrazy() {
  for (let i = 0; i < 10; ++i) {
    webViewJavaScriptBridge
      .sendMessage({
        action: "tester",
        params: {
          a: 1,
          b: 2,
          ch: "中文真第六",
        },
      })
      .then((resp) => {
        console.log("tester's response:", resp);
      });
  }
}
onMounted(() => {
  state.userAgent = navigator.userAgent;
  state.cookie = document.cookie;

  webViewJavaScriptBridge.registerMessageHandler("jsFunc", (params: string) => {
    return `js response ${params}`;
  });
});
</script>

<style scoped>
p {
  padding: 0px 10px;
  margin-bottom: 10px;
}
</style>
