const { Pool } = require("pg");
const { nanoid } = require("nanoid"); // Import nanoid
const bcrypt = require("bcrypt"); // Import bcrypt untuk enkripsi password
const notFoundError = require("../../exceptions/notFoundError");
const invariantError = require("../../exceptions/invariantError");
const AuthenticationError = require("../../exceptions/authenticationError");

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  // Menambahkan user dengan id_user yang dihasilkan oleh nanoid
  async addUser({ username, password }) {
    const id_user = nanoid(16); // Menghasilkan id_user dengan panjang 16 karakter
    const hashedPassword = await bcrypt.hash(password, 10); // Mengenkripsi password

    const query = {
      text: "INSERT INTO users (id_user, username, password) VALUES($1, $2, $3) RETURNING id_user",
      values: [id_user, username, hashedPassword], // Menggunakan password yang sudah dienkripsi
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id_user) {
      throw new invariantError("User gagal ditambahkan");
    }

    return result.rows[0].id_user;
  }

  // Mendapatkan semua data user
  async getUsers() {
    const result = await this._pool.query("SELECT * FROM users");
    return result.rows;
  }

  // Mengedit user berdasarkan id_user
  async editUserById(id_user, { username, password }) {
    const hashedPassword = await bcrypt.hash(password, 10); // Mengenkripsi password yang baru
    const query = {
      text: "UPDATE users SET username = $1, password = $2 WHERE id_user = $3 RETURNING id_user",
      values: [username, hashedPassword, id_user], // Menggunakan password yang sudah dienkripsi
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError(
        "Gagal memperbarui data user. ID user tidak ditemukan"
      );
    }
  }

  // Menghapus user berdasarkan id_user
  async deleteUserById(id_user) {
    const query = {
      text: "DELETE FROM users WHERE id_user = $1 RETURNING id_user",
      values: [id_user],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError("User gagal dihapus. ID user tidak ditemukan");
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id_user, password FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    const { id_user, password: hashedPassword } = result.rows[0]; // Ubah 'id' menjadi 'id_user'
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return id_user; // Kembalikan 'id_user' bukan 'id'
  }
}

module.exports = UserService;
