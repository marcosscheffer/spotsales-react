import React from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  return (
    <div className='container'>
      <h1>Usuarios</h1>
      <p>Configurações de usuarios</p>

      <table class="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">Position</th>
                <th scope="col">admin</th>
                <th scope="col">bot</th>
                <th scope="col">active</th>
                <th>actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td><i class="bi bi-check-circle"></i></td>
                <td><i class="bi bi-check-circle"></i></td>
                <td><i class="bi bi-x-circle"></i></td>
                <td><Link><i class="bi bi-pencil-square"></i></Link></td>
            </tr>
        </tbody>
    </table>

    </div>
  )
}

export default Users
