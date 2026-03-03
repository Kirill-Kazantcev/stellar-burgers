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
