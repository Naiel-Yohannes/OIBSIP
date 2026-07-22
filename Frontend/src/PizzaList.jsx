import { useState, useEffect } from 'react'
import { getPizzas } from './services/pizza'
import toast from 'react-hot-toast'

const PizzaList = () => {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)

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
  })

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
              <p>{pizza.description}</p>
              <p><strong>Price: ${pizza.price}</strong></p>
              <div>
                <strong>Ingredients:</strong>
                <ul>
                  {pizza.ingredients.map((ing, index) => (
                    <li key={index}>{ing.name} (x{ing.quantity})</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PizzaList