import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/page_manager'
import {faker} from '@faker-js/faker'
import { last } from 'rxjs-compat/operator/last'


/*
    **Page Object Model**

    - a design pattern used in test automation to organise source code, improve maintainability and reusability of the code
   - No industry implemented standard
   - every page of the web application has own "class" with a methods/functions responsible for operations on this page.
   - DRY - Do not repeat yourself
   - jUST KEEP IT SIMPLE
   - Descriptive naming is important aswell
   - Avoid tiny methods like this:

   async clickSubmit(){
   await this.page.getByRole('button', {name: "Log In"}).click()
   }

   -keep all locators seperated
    - 



*/

test.beforeEach(async({page}) => {
    await page.goto('/')

})
//test tags can be added and ran using the terminal with cmd npx playwright test --project=chromium --grep @smoke
test('navigate to form page @smoke', async({page}) => {

    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke @regression', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`


    await pm.navigateTo().formLayoutsPage()
    await pm.onFormslayoutsPage().UsingTheGridForm(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'}) //this is to take a screenshot of executed tests
    //this is to integrate screenshots to slack or other.
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormslayoutsPage().submitInlineForm(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inLineForm.png'}) //this is to take a screenshot of a particular section and not the whole page
    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().commonDatePicker(5)
    await pm.onDatePickerPage().datePickerRange(10, 15)
})

