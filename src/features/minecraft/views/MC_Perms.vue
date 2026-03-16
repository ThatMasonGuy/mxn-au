<template>
    <div class="container">
      <h1>LuckPerms Dashboard</h1>
      <button @click="fetchPlayers">Refresh Players</button>
      
      <div v-if="players.length > 0">
        <h2>Players</h2>
        <ul>
          <li v-for="player in players" :key="player.uuid" @click="fetchPermissions(player.uuid)">
            {{ player.name }} ({{ player.uuid }})
          </li>
        </ul>
      </div>
  
      <div v-if="selectedPlayer">
        <h2>Permissions for {{ selectedPlayer }}</h2>
        <ul>
          <li v-for="perm in permissions" :key="perm">
            {{ perm }}
            <button @click="removePermission(perm)">Remove</button>
          </li>
        </ul>
  
        <input v-model="newPermission" placeholder="New Permission">
        <button @click="addPermission">Add Permission</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        players: [],
        selectedPlayer: null,
        permissions: [],
        newPermission: "",
      };
    },
    methods: {
      async fetchPlayers() {
        try {
          const response = await axios.get("/api/players");
          this.players = response.data;
        } catch (error) {
          console.error("Failed to fetch players:", error);
        }
      },
      async fetchPermissions(uuid) {
        this.selectedPlayer = uuid;
        try {
          const response = await axios.get(`/api/permissions/${uuid}`);
          this.permissions = response.data;
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
        }
      },
      async addPermission() {
        if (!this.newPermission) return;
        try {
          await axios.post("/api/permissions", {
            uuid: this.selectedPlayer,
            permission: this.newPermission,
            action: "add",
          });
          this.permissions.push(this.newPermission);
          this.newPermission = "";
        } catch (error) {
          console.error("Failed to add permission:", error);
        }
      },
      async removePermission(permission) {
        try {
          await axios.post("/api/permissions", {
            uuid: this.selectedPlayer,
            permission,
            action: "remove",
          });
          this.permissions = this.permissions.filter((perm) => perm !== permission);
        } catch (error) {
          console.error("Failed to remove permission:", error);
        }
      },
    },
  };
  </script>
  
  <style>
  .container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  h1, h2 {
    color: #333;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    cursor: pointer;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  button {
    margin: 5px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  