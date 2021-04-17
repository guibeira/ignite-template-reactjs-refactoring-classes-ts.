import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export function Dashboard(){
    const [editingFood, setEditingFood] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        async function loadFoods(){
            let response = await api.get('/foods');
            setFoods(response.data);
        }
        loadFoods();
    }, []);

    const handleAddFood = async food => {
        try {
          const response = await api.post('/foods', {
            ...food,
            available: true,
          });
          setFoods([...foods, response.data]);
        } catch (err) {
          console.log(err);
        }
      }

    const handleUpdateFood = async editedFood => {
    try {
        const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
            { ...editedFood },
        );
      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      setFoods(foodsUpdated);
    } catch (err) {
        console.log(err);
      }
    }

    const handleDeleteFood = async id => {
        const foodsFiltered = foods.filter(food => food.id !== id);
        await api.delete(`/foods/${id}`);
        setFoods(foodsFiltered);
    }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = food => {
      setEditingFood(food)
      setEditModalOpen(true);
  }
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
    
}

export default Dashboard;
