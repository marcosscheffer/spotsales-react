import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import api from '../api/api'
import { useParams } from 'react-router-dom'
import logo from "../assets/logo-checklist.png"
import NavBar from '../components/NavBar'


const ChecklistFinal = () => {
    const [user, setUser] = useState()
    const [ts, setTs] = useState()
    const [admin, setAdmin] = useState()
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [error, setError] = useState()

    const [dataChecklist, setDataChecklist] = useState({})
    const [dataLead, setDataLead] = useState({})
    const { id } = useParams()

    const navigate = useNavigate()


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('user/me')
                setUser(res.data)
                setAdmin(res.data.admin)

            } catch (err) {
                navigate('/login?next=/checklist/4/' + id)
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resChecklist = await api.get("/checklist/" + id)
                setDataChecklist(resChecklist.data)
                const resLead = await api.get("/leadsSales/" + id)
                setDataLead(resLead.data)
                setTs(resChecklist.data.ts)
                console.log(resChecklist)
                setLoading(false)
            } catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [])

    function formatDateToDDMMYYYY(dateString) {
        const date = new Date(dateString)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
      
        return `${day}/${month}/${year}`
      }

      const generatePdf = () => {
        setButtonLoading(true);
        const input = document.getElementById('pdf-content');
        
        html2canvas(input, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
    
          // Defina o tamanho da página A4
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = 210; 
          const pdfHeight = 297; 
    
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    
          const imgWidth = canvasWidth * ratio;
          const imgHeight = canvasHeight * ratio;
    
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
          const pdfBlob = pdf.output('blob'); 
    
          const formData = new FormData();
          formData.append('file', pdfBlob, 'documento.pdf'); 
          formData.append("ts", ts)
    
          api.post('/slack/send/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            console.log('PDF enviado com sucesso:', response.data);
            setButtonLoading(false);
          })
          .catch(error => {
            console.error('Erro ao enviar o PDF:', error);
            setButtonLoading(false);
          });
        }).catch(error => {
          console.error('Erro ao gerar o PDF:', error);
          setButtonLoading(false);
        });
      };

    
    if (loading) {
        return <div>Carregando...</div>
    }
  return (
    <>
        <NavBar userData={user} admin={admin} />
        <div className="container bg-secondary-subtle p-4">
            <h1>Checklist Final</h1>
            <p>pré-vizualização do checklist feita, confirme os dados e se estiver correto, então envie</p>
            <div id='pdf-content' className='border bg-white p-5'>
                <p>{new Date().toLocaleString()}</p>
                <img src={logo} className="img-fluid" alt="logo" style={{width: '7em'}}></img>
                <h1 className='text-center'>Check-List</h1>

                <div className="container mt-5">
                    <div className="row align-items-start">
                        <div className="col">
                            <b>Cliente: </b>{dataLead.company}
                        </div>
                        <div className="col">
                            <b>Vendedor: </b>{dataLead.seller_name}
                        </div>
                        <div className="col">
                            <b>Data da venda: </b> {formatDateToDDMMYYYY(dataLead.sale_date)}
                        </div>
                        <div className="col">
                            <b>Preenchido: </b> {user.name}
                        </div>
                    </div>
                </div>

                <hr />
                <h2>Equipamentos</h2>
                <table className="table table-bordered mt-3">
                    <tbody>
                        <tr>
                            <th scope='row'>Pôtencia</th>
                            <td>{dataChecklist.power}CV</td>
                        </tr>
                        <tr>
                            <th scope='row'>Fase</th>
                            <td>{dataChecklist.phases == 1 ? "Monofásico" : "Trifásico"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Voltagem</th>
                            <td>{dataChecklist.voltage}V</td>
                        </tr>
                        <tr>
                            <th scope='row'>Projeto Especial</th>
                            <td>{dataChecklist.special_project ? "Sim" : "Não"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Chave Elétrica Liga/Desliga/Botoeira</th>
                            <td>{dataChecklist.eletric_key ? "Sim" : "Não"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Painel Elétrico NR-10</th>
                            <td>{dataChecklist.eletric_panel ? "Sim" : "Não"}</td>
                        </tr>
                        {dataChecklist.description_panel && (
                            <tr>
                                <th scope='row'>Descrição do painel</th>
                                <td>{dataChecklist.description_panel}</td>
                            </tr>
                        )}
                        <tr>
                            <th scope='row'>Layout</th>
                            <td>{dataChecklist.layout ? "Sim" : "Não"}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Tubulação</h2>
                <table className="table table-bordered mt-3">
                    <tbody>
                        <tr>
                            <th scope='row'>Tubulação</th>
                            <td>{dataChecklist.pipeline ? "Sim" : "Não"}</td>
                        </tr>
                        {dataChecklist.pipeline && (
                            <tr>
                                <th scope='row'>Descrição da tubulação</th>
                                <td>{dataChecklist.description_pipeline}</td>
                            </tr>
                        )}
                        <tr>
                            <th scope='row'>Pintura Especial</th>
                            <td>{dataChecklist.special_paint ? "Sim" : "Não"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Filtros Extras</th>
                            <td>{dataChecklist.extra_filters ? "Sim" : "Não"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Montagem</th>
                            <td>{dataChecklist.assembly ? "Sim" : "Não"}</td>
                        </tr>
                        {dataChecklist.assembly && (
                            <tr>
                                <th scope='row'>Responsavel pela montagem</th>
                                {dataChecklist.responsible_assembly === "tm" && (<td>TM</td>)}
                                {dataChecklist.responsible_assembly === "outsourced" && (<td>Terceirizado</td>)}
                                {dataChecklist.responsible_assembly === "client" && (<td>Cliente</td>)}
                            </tr>
                        )}
                    </tbody>
                </table>

                <h2>Entrega</h2>
                <table className="table table-bordered mt-3">
                    <tbody>
                        <tr>
                            <th scope='row'>Frete</th>
                            <td>{dataChecklist.fright == "cif" ? "CIF" : "FOB"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Palete</th>
                            <td>{dataChecklist.pallet ? "Sim" : "Não"}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Prazo</th>
                            <td>{formatDateToDDMMYYYY(dataChecklist.deadline)}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Endereço de entrega</th>
                            <td>{dataChecklist.type_address === "sintegra" ? "Sintegra" : dataChecklist.address}</td>
                        </tr>
                    </tbody>
                </table>
                <h1 className='text-center mt-3'>Check-list Final</h1>
                <div class="container mt-3">
                    <div class="row align-items-start">
                        <div class="col">
                            <p><i class="bi bi-square"></i> Paineis/Chapas</p>
                            <p><i class="bi bi-square"></i> Painel Elétrico NR-10</p>
                            <p><i class="bi bi-square"></i> Flanges</p>
                            <p><i class="bi bi-square"></i> Palete</p>
                            <p><i class="bi bi-square"></i> Selantes</p>
                        </div>
                        <div class="col">
                            <p><i class="bi bi-square"></i> Voltagem</p>
                            <p><i class="bi bi-square"></i> Tubulação</p>
                            <p><i class="bi bi-square"></i> Filtros Extras</p>
                            <p><i class="bi bi-square"></i> Pintura</p>
                            <p><i class="bi bi-square"></i> outros_____</p>

                        </div>
                        <div class="col">
                            <p><i class="bi bi-square"></i> Suporte/Pés</p>
                            <p><i class="bi bi-square"></i> Chave Elétrica</p>
                            <p><i class="bi bi-square"></i> Vedação</p>
                            <p><i class="bi bi-square"></i> Filtros</p>
                            
                        </div>
                        <div class="col">
                            <p><i class="bi bi-square"></i> Pôtencia de Motor</p>
                            <p><i class="bi bi-square"></i> Curvas</p>
                            <p><i class="bi bi-square"></i> Manual de montagem</p>
                            <p><i class="bi bi-square"></i> Parafusos/Arruelas/Porcas</p>

                        </div>
                    </div>
                </div>
                
            </div>
            <button className="btn btn-primary m-2" onClick={(e) => navigate("/checklist/3/" + id)}>Voltar</button>
            <button onClick={generatePdf} className='btn btn-success m-2'>Enviar</button>

        </div>

    </>
  )
}

export default ChecklistFinal
