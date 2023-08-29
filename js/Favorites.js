import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }
  
  async addUser(username) {
    username = document.querySelector('#search-input').value;
    try {
      const userExists = this.entries.find(entry => entry.login == username);
      console.log(userExists);

      if(userExists) {
        throw new Error('Usuário já cadastrado');
      }

      const user = await GithubUser.search(username);

      if (user.login == undefined) {
        throw new Error('Usuário não encontrado');
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } 
    catch(error) {
      alert(error.message);
    }
  }

  delete(user) {
    this.entries = this.entries.filter(entry => entry.login != user.login);
    this.update();
    this.save();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root);
    this.tbody = this.root.querySelector('tbody');
    this.removeAllTr();
    this.update();
    this.handleAddUserClick();
  }

  update() {
    this.removeAllTr();
    this.entries.forEach(user => {
      const row = this.createRow(user);
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?');
        if(isOk) {
          this.delete(user);
        }
      }
      this.tbody.append(row);
    })
  }

  handleAddUserClick() {
    const addUserButton = document.querySelector('#favorite');
    addUserButton.onclick = () => {
      const { value } = this.root.querySelector('#search-input');
      this.addUser(value);
    }
  }

  createRow(user) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<tr>
      <td class="user">
        <img src="https://github.com/${user.login}.png" alt="Foto de ${user.name}">
          <a href="https://github.com/${user.login}" target="_blank">
            <p>${user.name}</p>
            <span>/${user.login}</span>
          </a>
      </td>
        <td class="repositories">${user.public_repos}</td>
        <td class="followers">${user.followers}</td>
        <td><button class="remove">Remover</button></td>
      </tr>`

      return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()});
  }
}