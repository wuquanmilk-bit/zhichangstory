describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  });

  it(
    'describe(\'项目功能巡检\', () => {   it(\'检查 5173 页面是否能正常访问并点击链接\', () => {     // 1. 访问你的本地项目     cy.visit(\'http://localhost:5173\')      // 2. 检查页面标题是否存在，确认页面没白屏     cy.get(\'body\').should(\'be.visible\')      // 3. 自动找出所有链接，并尝试点击第一个看看     // 这能帮你定位为什么“链接功能无法实现”     cy.get(\'a\').first().click()          // 4. 如果点击后控制台报错，Cypress 会在这里直接显示红色的错误堆栈   }) })',
    function() {
    cy.visit('http://localhost:5173/')
    
    }
  );
});

it(
  'describe(\'项目功能巡检\', () => {   it(\'检查 5173 页面是否能正常访问并点击链接\', () => {     // 1. 访问你的本地项目     cy.visit(\'http://localhost:5173\')      // 2. 检查页面标题是否存在，确认页面没白屏     cy.get(\'body\').should(\'be.visible\')      // 3. 自动找出所有链接，并尝试点击第一个看看     // 这能帮你定位为什么“链接功能无法实现”     cy.get(\'a\').first().click()          // 4. 如果点击后控制台报错，Cypress 会在这里直接显示红色的错误堆栈   }) })',
  function() {

  }
);