<template>
    <div class="friend-circle">
      <div class="form-group">
        <input type="file" @change="selectImage" />
      </div>
      <div class="form-group">
        <textarea v-model="textInput" placeholder="请输入文字内容"></textarea>
      </div>
      <div class="form-group">
        <button @click="submitPost">发布</button>
      </div>
      <div class="preview">
        <div v-if="selectedImage" class="image-preview">
          <img :src="selectedImage" alt="Selected Image" />
        </div>
        <p>{{ textInput }}</p>
      </div>
    </div>
  </template>
  
<script>
  export default {
    data() {
      return {
        selectedImage: '',
        textInput: ''
      };
    },
    methods: {
      selectImage(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      },
      submitPost() {
        // 在这里添加发布逻辑
        const post = {
          image: this.selectedImage,
          text: this.textInput
        };
        console.log('提交的朋友圈内容：', post);
        // 重置表单数据
        this.selectedImage = '';
        this.textInput = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .friend-circle {
    margin: 20px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  textarea {
    width: 100%;
    height: 100px;
  }
  
  .image-preview {
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
  }
  
  .preview p {
    margin-top: 0;
  }
  </style>