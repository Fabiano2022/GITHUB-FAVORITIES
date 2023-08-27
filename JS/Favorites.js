import { GithubUser } from "./GithubUser.js"

/* Classe que vai conter a lógica dos dados (como os dados serão estruturados) 
as classes ficaram unidas utilizando a ideia de herança: */
export class Favorites {
    constructor (root) { //root - é o nosso app (HTML), ou seja todo o nosso projeto.
        this.root = document.querySelector(root)
        this.load()

    } 

    load() {
        this.entries  = JSON.parse(localStorage.getItem('@github-favorites:')) || []   
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    //caso o usuário não esteja cadastrado (try, throw e catch):
    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            console.log(userExists)

            if(userExists) {
                throw new Error ('Usuário já cadastrado!')
            }




            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()


        } catch(error) {
            alert(error.message)
        }
    }

//DELETANDO USUÁRIO UTILIZANDO O PRINCIPIO DA IMUTABILIDADE:
    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
        }
    }

//Classe que vai criar a visualização e elementos do HTML (guardar os dados):
export class FavoritesView extends Favorites {       //através do extend estamos unindo as duas classes
    constructor(root) {
        super(root) // essa linha é como se estivesse criando a cola entre as duas classes.
        
        this.tbody = this.root.querySelector('table tbody')
        
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }
    
    //Função update tem alguns passos:
    update() { 
        this.removeAllTr()
    
        this.entries.forEach(user => {
        const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                   this.delete(user) 
                }

            }
        
            this.tbody.append(row)
    })  
    
    }

    //criar cada coluna :

    createRow() { 
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="http://github.com/Fabiano2022.png" alt="imagem github">
                <a href="http://github.com/Fabiano2022" target="_blanks">
                <p>Fabiano Oliveira</p>
                <span>Fabiano2022</span>
                </a>
            </td>
        <td class="repositories">76</td>
        <td class="followers">1000</td>                        
        <td>
            <button class="remove">Remover</button>
        </td>                                
`

        return tr
    }

//Função que irá remover os elementos da tabela:
    removeAllTr () {    
       this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
       })
    }
}


