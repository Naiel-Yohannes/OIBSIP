import { useState, useEffect } from 'react'
import { getPizzas } from './services/pizza'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PizzaList = () => {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await getPizzas()
        setPizzas(data)
      } catch(error){
        toast.error('Failed to fetch pizzas:', error)
      } finally{
        setLoading(false)
      }
    }

    fetchPizzas()
  }, [])

  if (loading) {
    return <div>Loading pizzas...</div>
  }

  return (
    <div>
      <h2>Pizza Menu</h2>
      {pizzas.length === 0 ? (
        <p>No pizzas available</p>
      ) : (
        <div>
          {pizzas.map((pizza) => (
            <div key={pizza.id}>
              <img src={pizza.imageUrl} alt={pizza.name} />
              <h3>{pizza.name}</h3>
              <p><strong>Price: ${pizza.price}</strong></p>
              <button onClick={() => navigate(`/pizza/${pizza.id}`)}>Customize</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PizzaList