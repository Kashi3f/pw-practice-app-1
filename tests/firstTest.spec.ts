// import test method from the playwright library
import {test, expect} from '@playwright/test'

// to create test suits - run multiple tests under one test suite
/*test.describe('test suite 1', () => {
    test('first test', () => {

    })
})*/

//Hooks and Flow Control 
test.beforeEach(async({page}) => {
    // to run test on localhost:4200 you need to run npm start to start up server and then run tests on browser
    await page.goto('/') // this baseURL is in the playwright.spec.ts as 'http://localhost:4200/
   await page.getByText('Forms').click()
   await page.getByText('Form Layouts').click()
})

// the argument for our test function is the playwright ({page}) fixture which opens a blank page of the browser
test('Locator syntax rules', async({page}) => {
    //find locator by Tag name
     page.locator('input')

     //by ID - # is used to identify it as ID locator
     await page.locator('#inputEmail1')

     //by Class - (.) is used to identify it as a Class Locator
     page.locator('.shape-rectangle')

     //by attribute - [] to find by value
     page.locator('[placeholder="Email"]')

     //find by entire Class value
     page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

     // combine different selectors
     page.locator('input[placeholder="Email"].shape-rectangle')

     //find by XPath (NOT RECOMMENDED)
     page.locator('//*[@id="inputEmail1"]')

     //find element by partial text match
     page.locator(':text("Using")')

    //find by exact text match
    // page.locator(`:text-is("Using the Grid")`)
})

//User-Facing Locators
test('User facing locators', async ({page}) => {
    //Role is the type of the element that we're trying to interact with
      await page.getByRole('textbox', { name: 'Email' }).first().click()
      await page.getByRole('button', { name: 'Sign in' }).first().click()

      await page.getByLabel('Email').first().click()

      await page.getByPlaceholder('Jane Doe').click()
      
      await page.getByText('Using the grid').click()

      //By searching in VS code search option for "Sign in" you'll view the page source code
      //on the HTML Source code form layouts add data-testid="SignIn" to the button, the name should be unique to which you use in your getByTestId
      await page.getByTestId('SignIn').click()

      await page.getByTitle('IoT Dashboard').click()

      
})

//Child Elements
test('locating child elements', async({page}) => {
    //by locating child elements, just seperate the locators with a space within your string locator
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    //another way to chain element locators
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    //to locate a duplicate button on the same card we can combine the locator and the user facing locators
    //nb-card locator is not needed but the user facing locator is fine to use
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    //less preferable approach for locating child elements is:
    //.nth() is the index of the element
    //aavoid using selecting by index
    await page.locator('nb-card').nth(3).getByRole('button').click()


})

//Parent elements
test('parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).click()

    //you can provide a 2nd attribute as a locator
    //Do not forget the # for the locator ID as #inputEmail1
    //By adding a second argument for the locator you can filter which element you're looking for.
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).click()

    //The filter method in VS is pretty much the same as the prevoius locator filter build
    //much easier to read and better to use
    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).click()

    //using a locator as a filter by using a class locator '.status-danger'
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).click()

    //Filter by using the parent locator of the checkbox
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: 'Email'}).click()

    //another way of finding a parent element but its not recommended (by using XPath)
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click()



})

//Reusing locators
test('reusing locators', async({page}) => {
    //sequence to filling out the basic form
    //refactor the code by creating a const for your 'Basic Form locator'
    //by creating a variable its easier to use and to format the code
    //by creating 2 variables and using both locators for it, it makes the code more readible
    const basicForm =  page.locator('nb-card').filter({hasText: 'Basic form'})
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: 'Password'}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    //writing an assessertion
    //after the email field has been filled we expect it to hold a value after
    await expect(emailField).toHaveValue('test@test.com')

})

//Extractin values
test('extracting values', async({page}) => {
    //single text value = .textContent
    const basicForm =  page.locator('nb-card').filter({hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //how to get all text values = .allTextContents() - which is an array[]
    // allTextContents will grab all the values of the element('nb-radio')array and then the assertion(expect) validates that 1 of the radio buttons is in the array
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain('Option 1')

    //how to find the value of the input field(not everything is text being displayed but it can be properties)
    //text being displayed in text fields is possibly placeholders
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})
    await emailField.fill('test@test.com')

    //if you want to grab a value from UI which is not text but an input value then you use the method inputValue
    //property value of an input field which is not a text = .inputValue()
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    //get the value of an attribute
    //how to validate if the email field placeholder is there
    //to get value of any attributes on the form = .getAttribute() and provide the argument for it which is 'placeholer'
    const placeholderValue = emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

//Assertions
test('assertion', async({page}) => {
    //two types of assertions (general assertions & locator type assertions)

    const basicFormButton =  page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button')
    //-General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion
    //Locator assertions will always wait 5sec whereas general assertions does not have a waiting time
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertions
    //it will continue the test execution even if the assertion fails
    //not a really good practice
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

})

//Auto Waiting
//to reduce flakyness in tests
test('auot waiting', async({page}) => {
   
})
