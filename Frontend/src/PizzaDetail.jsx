import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPizzaById } from './services/pizza'
import { getAvailableIngredients } from './services/inventory'
import toast from 'react-hot-toast'

const PizzaDetail = () => {
  const {id} = useParams()
  const [pizza, setPizza] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [availableIngredients, setAvailableIngredients] = useState([])

  useEffect(() => {
    const getPizza = async () => {
      try{
        const data = await getPizzaById(id)
        const fetchAvailableIngredients = await getAvailableIngredients()
        setPizza(data)
        setIngredients(data.ingredients)
        setAvailableIngredients(fetchAvailableIngredients)
      } catch(error){
        toast.error('Error fetching pizza: ' + error.message)
      } finally{
        setLoading(false)
      }
    }
    getPizza()
  }, [id])

  const decreaseQuantity = (name) => {
    setIngredients(prevIngredients =>
      prevIngredients.map(ing =>
        ing.name === name && ing.quantity > 0
          ? {...ing, quantity: ing.quantity - 1}
          : ing
      )
    )
  }

  const increaseQuantity = (name) => {
    setIngredients(prevIngredients =>
      prevIngredients.map(ing =>
        ing.name === name && ing.quantity < 2
          ? {...ing, quantity: ing.quantity + 1}
          : ing
      )
    )
  }

  const addIngredient = (item) => {
    setIngredients(prevIngredients => [...prevIngredients, {name: item, quantity: 1}])
  }

  const calculatePrice = () => {
    return ingredients.reduce((total, ing) => {
      const availableItem = availableIngredients.find(avail => avail.item === ing.name)
      const price = availableItem ? availableItem.price : 0
      return total + (price * ing.quantity)
    }, 0)
  }

  if(loading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Pizza Detail</h1>
      {pizza ? (
        <div>
          <h2>{pizza.name}</h2>
          <p>{pizza.description}</p>
          <p>Price: ${calculatePrice()}</p>
          <img src={pizza.imageUrl} alt={pizza.name} />
          <h3>Ingredients:</h3>
          <ul>
            {ingredients.map(ing => (
              <li key={ing.name}>
                <button onClick={() => decreaseQuantity(ing.name)}>-</button>
                <span>{ing.name}: {ing.quantity}</span>
                <button onClick={() => increaseQuantity(ing.name)}>+</button>
              </li>
            ))}
          </ul>
          <div>
            <h3>Available Ingredients:</h3>
            <ul>
              {availableIngredients
                .filter(ing => !ingredients.some(p => p.name === ing.item))
                .map(ing => (
                  <li key={ing._id}>{ing.item}: <button onClick={() => addIngredient(ing.item)}>Add Topping</button></li>
                ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Pizza not found</p>
      )}
    </div>
  )
}

export default PizzaDetail