<template>
  <v-container>
    <v-responsive>
      <v-app-bar color="primary" density="compact">
        <v-toolbar-title class="flex text-center"
          ><v-btn icon="mdi-menu"></v-btn>Latest Posts</v-toolbar-title
        >
      </v-app-bar>
      <v-main>
        <v-alert
          v-if="error"
          icon="mdi-alert-circle"
          type="error"
          variant="tonal"
          >{{ error }}</v-alert
        >
        <div>
          <v-row align="center">
            <v-col>
              <v-textarea
                clearable
                auto-grow
                label="Post something..."
                variant="filled"
                v-model="text"
                rows="1"
              ></v-textarea>
            </v-col>
            <v-col><v-btn color="primary" v-on:click="createPost">Post!</v-btn></v-col>
          </v-row>
        </div>
        <div
          v-for="(post, index) in posts"
          v-bind:item="post"
          v-bind:index="index"
          v-bind:key="post._id"
        >
          <v-card class="mx-auto" variant="tonal" color="green">
            <v-card-subtitle>{{
              `${post.createdAt.getMonth()}/${post.createdAt.getDate()}/${post.createdAt.getFullYear()}`
            }}</v-card-subtitle>
            <v-card-text>{{ post.text }}</v-card-text>
            <v-card-actions
              ><v-btn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-square-edit-outline" v-on:click="openDialog(post)"
                >Edit</v-btn
              ><v-btn
                variant="tonal"
                color="secondary"
                prepend-icon="mdi-delete-off-outline" v-on:click="deletePost(post)"
                >Delete</v-btn
              ></v-card-actions
            >
          </v-card>
          <br />
        </div>
      </v-main>
      <!-- Add Dialog -->
      <v-dialog v-model="editDialog" persistent max-width="300px">
        <v-card>
          <v-form ref="taskform">
            <v-card-title><v-icon size="x-small">mdi-square-edit-outline</v-icon>
              Edit Post</v-card-title>
            <v-card-text>
              <v-textarea
                clearable
                auto-grow
                variant="filled"
                v-model="editText"
                rows="1"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="elevated" prepend-icon="mdi-square-edit-outline" size="small" color="primary"
                @click="savePost" type="submit">save</v-btn>
              <v-btn variant="elevated" prepend-icon="mdi-cancel" size="small" color="red"
                @click="editDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-responsive>
  </v-container>
</template>

<script>
import PostService from "../PostService";

export default {
  name: "PostComponent",
  data() {
    return {
      posts: [],
      error: '',
      text: '',
      editDialog: false,
      editText: '',
      editId: ''
    };
  },
  async created() {
    try {
      this.posts = await PostService.getPosts();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async createPost() {
      await PostService.insertPost(this.text);
      this.posts = await PostService.getPosts();
      this.text = '';
    },
    async deletePost(post) {
      await PostService.deletePost(post._id);
      this.posts = await PostService.getPosts();
    },
    openDialog(item) {
      this.editDialog = true;
      this.editId = item._id;
      this.editText = item.text;
    },
    async savePost() {
      this.editDialog = false;
      await PostService.updatePost(this.editId, this.editText);
      this.posts = await PostService.getPosts();
    }
  }
};
</script>

