import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Подменяем uuid, чтобы всегда получать один и тот же id
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('constructorSlice', () => {
  // Начальное состояние - пустой конструктор
  const initialState = {
    bun: null,
    ingredients: []
  };

  // Тестовые данные
  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  const mockMain: TIngredient = {
    _id: 'main-1',
    name: 'Начинка',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 50,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  // Ингредиенты с готовыми id для тестов
  const mockIngredient1: TConstructorIngredient = {
    ...mockMain,
    id: 'ingredient-1'
  };

  const mockIngredient2: TConstructorIngredient = {
    ...mockMain,
    _id: 'main-2',
    name: 'Начинка 2',
    id: 'ingredient-2'
  };

  const mockIngredient3: TConstructorIngredient = {
    ...mockMain,
    _id: 'main-3',
    name: 'Начинка 3',
    id: 'ingredient-3'
  };

  // Тест начального состояния
  test('должен возвращать начальное состояние', () => {
    expect(constructorSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addIngredient - добавление ингредиентов', () => {
    test('должен добавлять булку в пустой конструктор', () => {
      const action = addIngredient(mockBun);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toHaveLength(0);
    });

    test('должен заменять существующую булку при добавлении новой', () => {
      const stateWithBun = {
        bun: mockBun,
        ingredients: []
      };

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Новая булка'
      };

      const action = addIngredient(newBun);
      const newState = constructorSlice.reducer(stateWithBun, action);

      expect(newState.bun).toEqual(newBun);
      expect(newState.ingredients).toHaveLength(0);
    });

    test('должен добавлять начинку с уникальным id', () => {
      const action = addIngredient(mockMain);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe(mockMain._id);
      expect(newState.ingredients[0].name).toBe(mockMain.name);
      expect(newState.ingredients[0].id).toBe('test-uuid-123');
    });

    test('должен добавлять соус с уникальным id', () => {
      const action = addIngredient(mockSauce);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe(mockSauce._id);
      expect(newState.ingredients[0].name).toBe(mockSauce.name);
      expect(newState.ingredients[0].id).toBe('test-uuid-123');
    });

    test('должен добавлять несколько начинок подряд', () => {
      // Добавляем первую начинку
      const action1 = addIngredient(mockMain);
      const stateAfterFirst = constructorSlice.reducer(initialState, action1);
      
      // Добавляем вторую начинку
      const secondMain: TIngredient = {
        ...mockMain,
        _id: 'main-2',
        name: 'Начинка 2'
      };
      const action2 = addIngredient(secondMain);
      const stateAfterSecond = constructorSlice.reducer(stateAfterFirst, action2);

      expect(stateAfterSecond.bun).toBeNull();
      expect(stateAfterSecond.ingredients).toHaveLength(2);
      expect(stateAfterSecond.ingredients[0]._id).toBe(mockMain._id);
      expect(stateAfterSecond.ingredients[0].id).toBe('test-uuid-123');
      expect(stateAfterSecond.ingredients[1]._id).toBe('main-2');
      expect(stateAfterSecond.ingredients[1].id).toBe('test-uuid-123');
    });

    test('должен добавлять булку и начинки вместе', () => {
      // Добавляем булку
      const bunAction = addIngredient(mockBun);
      const stateWithBun = constructorSlice.reducer(initialState, bunAction);
      
      // Добавляем начинку
      const ingredientAction = addIngredient(mockMain);
      const finalState = constructorSlice.reducer(stateWithBun, ingredientAction);

      expect(finalState.bun).toEqual(mockBun);
      expect(finalState.ingredients).toHaveLength(1);
      expect(finalState.ingredients[0]._id).toBe(mockMain._id);
    });
  });

  describe('удаление ингредиентов', () => {
    test('должен удалять ингредиент из конструктора по id', () => {
      // Подготовка: в конструкторе есть булка и 3 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      // Действие: удаляем вторую начинку
      const action = removeIngredient('ingredient-2');
      const newState = constructorSlice.reducer(stateWithIngredients, action);

      // Проверка: булка осталась, начинок стало 2, порядок сохранился
      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0].id).toBe('ingredient-1');
      expect(newState.ingredients[1].id).toBe('ingredient-3');
    });

    test('должен ничего не менять при удалении несуществующего id', () => {
      // Подготовка: в конструкторе есть булка и 2 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      // Действие: пытаемся удалить несуществующий ингредиент
      const action = removeIngredient('non-existent-id');
      const newState = constructorSlice.reducer(stateWithIngredients, action);

      // Проверка: состояние не изменилось
      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    });
  });

  describe('перемещение ингредиентов', () => {
    test('должен перемещать ингредиент вверх', () => {
      // Подготовка: в конструкторе есть булка и 3 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      // Действие: перемещаем вторую начинку вверх
      const action = moveIngredientUp(1);
      const newState = constructorSlice.reducer(stateWithIngredients, action);

      // Проверка: вторая стала первой, первая стала второй
      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe('ingredient-2');
      expect(newState.ingredients[1].id).toBe('ingredient-1');
      expect(newState.ingredients[2].id).toBe('ingredient-3');
    });

    test('не должен перемещать первый ингредиент вверх', () => {
      // Подготовка: в конструкторе есть булка и 3 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      // Действие: пытаемся переместить первую начинку вверх
      const action = moveIngredientUp(0);
      const newState = constructorSlice.reducer(stateWithIngredients, action);

      // Проверка: порядок не изменился
      expect(newState.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2,
        mockIngredient3
      ]);
    });

    test('должен перемещать ингредиент вниз', () => {
      // Подготовка: в конструкторе есть булка и 3 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      // Действие: перемещаем вторую начинку вниз
      const action = moveIngredientDown(1);
      const newState = constructorSlice.reducer(stateWithIngredients, action);

      // Проверка: вторая стала третьей, третья стала второй
      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].id).toBe('ingredient-1');
      expect(newState.ingredients[1].id).toBe('ingredient-3');
      expect(newState.ingredients[2].id).toBe('ingredient-2');
    });

    test('не должен перемещать последний ингредиент вниз', () => {
      // Подготовка: в конструкторе есть булка и 3 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      // Действие: пытаемся переместить последнюю начинку вниз
      const action = moveIngredientDown(2);
      const newState = constructorSlice.reducer(stateWithIngredients, action);

      // Проверка: порядок не изменился
      expect(newState.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2,
        mockIngredient3
      ]);
    });

    test('не должен ничего делать при перемещении с некорректным индексом', () => {
      // Подготовка: в конструкторе есть булка и 2 начинки
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      // Действие: пытаемся переместить с отрицательным индексом
      const actionUp = moveIngredientUp(-1);
      const stateAfterUp = constructorSlice.reducer(
        stateWithIngredients,
        actionUp
      );
      expect(stateAfterUp.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2
      ]);

      // Действие: пытаемся переместить с индексом больше длины массива
      const actionDown = moveIngredientDown(5);
      const stateAfterDown = constructorSlice.reducer(
        stateWithIngredients,
        actionDown
      );
      expect(stateAfterDown.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2
      ]);
    });
  });

  describe('очистка конструктора', () => {
    test('должен очищать конструктор (удалять булку и все ингредиенты)', () => {
      // Подготовка: в конструкторе есть булка и 3 начинки
      const stateWithItems = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      // Действие: очищаем конструктор
      const action = clearConstructor();
      const newState = constructorSlice.reducer(stateWithItems, action);

      // Проверка: конструктор пуст
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });
});
