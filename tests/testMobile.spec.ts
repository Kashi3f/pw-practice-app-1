import {test, expect} from '@playwright/test'
 
 
 test('input fields', async({page}, testInfo) => {

    await page.goto('http://localhost:4200/')
    if(testInfo.project.name == 'mobile'){

    await page.locator('.sidebar-toggle').click() //this only works for mobile devives as chromium based browsers does not have the locator class ('.sidebar-toggle')

    }
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    if(testInfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }
        const theGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await theGridEmailInput.fill('test@test.com')
        //to clear the field
        await theGridEmailInput.clear()

        //if you wanna see the text being typed in sequentially
        await theGridEmailInput.pressSequentially('test2@test.com')

    })