/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Подменяем запросы к серверу на тестовые данные
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Добавляем тестовые токены
    cy.setCookie('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');

    // Открываем главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Удаляем тестовые токены
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      // Находим булку и нажимаем кнопку "Добавить"
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      // Проверяем, что булка появилась сверху и снизу
      cy.get('[data-cy=constructor-bun-top]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-bun-bottom]').should('contain', 'Краторная булка N-200i');
    });

    it('должен добавлять начинку в конструктор', () => {
      // Находим начинку и нажимаем кнопку "Добавить"
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .click();

      // Проверяем, что начинка появилась в списке
      cy.get('[data-cy=constructor-ingredients]').should(
        'contain',
        'Филе Люминесцентного тетраодонтимформа'
      );
    });

    it('должен добавлять соус в конструктор', () => {
      // Находим соус и нажимаем кнопку "Добавить"
      cy.contains('Соус Spicy-X').parent().find('button').click();

      // Проверяем, что соус появился в списке
      cy.get('[data-cy=constructor-ingredients]').should(
        'contain',
        'Соус Spicy-X'
      );
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно ингредиента при клике', () => {
      // Кликаем по ингредиенту
      cy.contains('Краторная булка N-200i').click();

      // Проверяем, что окно открылось и показывает название
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal]').should('contain', 'Краторная булка N-200i');
    
      // Проверяем, что в окне есть цена (любое число)
      cy.get('[data-cy=modal]').contains(/\d+/).should('exist');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      // Открываем окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy=modal]').should('be.visible');

      // Закрываем через крестик
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      // Открываем окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy=modal]').should('be.visible');

      // Закрываем кликом по фону
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должен закрывать модальное окно по нажатию Escape', () => {
      // Открываем окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy=modal]').should('be.visible');

      // Закрываем клавишей Esc
      cy.get('body').type('{esc}');
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ с выбранными ингредиентами', () => {
      // Добавляем булку, начинку и соус
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .click();
      cy.contains('Соус Spicy-X').parent().find('button').click();

      // Оформляем заказ
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяем номер заказа
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=order-number]').should('contain', '12345');

      // Закрываем окно с заказом
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');

      // Проверяем, что конструктор очистился
      cy.get('[data-cy=constructor-ingredients]').should('not.contain', 'Филе Люминесцентного тетраодонтимформа');
      cy.get('[data-cy=constructor-ingredients]').should('not.contain', 'Соус Spicy-X');
      cy.get('[data-cy=constructor-bun-top]').should('not.contain', 'Краторная булка N-200i');
    });

    it('должен перенаправлять на страницу логина для неавторизованного пользователя', () => {
      // Удаляем токены - теперь пользователь не авторизован
      cy.clearCookie('accessToken');
      window.localStorage.removeItem('refreshToken');
      
      // Обновляем страницу
      cy.reload();
      cy.wait('@getIngredients');

      // Добавляем булку
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      // Пытаемся оформить заказ
      cy.contains('Оформить заказ').click();

      // Проверяем, что перекинуло на страницу входа
      cy.url().should('include', '/login');
    });
  });
});
