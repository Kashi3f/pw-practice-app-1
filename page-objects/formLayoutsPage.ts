import {Page} from '@playwright/test';

export class FormLayoutsPage{
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    //submit using the gridform with credentials and select options
    async UsingTheGridForm(email: string, password: string, optionText: string){
        const theGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await theGridForm.getByRole('textbox', {name: "Email"}).fill(email)
        await theGridForm.getByRole('textbox', {name: "Password"}).fill(password)
        await theGridForm.getByRole('radio', {name: optionText}).check({force: true})
        await theGridForm.getByRole('button').click()

    }

    /**
     * This method fill out the Inline form with user details
     * @param name - should be first and last name
     * @param email - valid email for test user
     * @param rememberMe - true or false if user session saved
     */
    async submitInlineForm(name: string, email: string, rememberMe: boolean){

            const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
            await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
            await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
            if(rememberMe)
                await inlineForm.getByRole('checkbox').check({force: true})
            await inlineForm.getByRole('button').click()

    }
}