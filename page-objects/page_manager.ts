import {expect, Page} from '@playwright/test';
import { NavigationPage } from '../page-objects/navigationPage';
import { FormLayoutsPage } from '../page-objects/formLayoutsPage';
import { DatePickerPage } from '../page-objects/datePickersPage';

export class PageManager{

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formlayouts: FormLayoutsPage
    private readonly datePicker: DatePickerPage

    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formlayouts = new FormLayoutsPage(this.page)
        this.datePicker = new DatePickerPage(this.page)
    }

    navigateTo(){
        return this.navigationPage
    }

    onFormslayoutsPage(){
        return this.formlayouts
    }

    onDatePickerPage(){
        return this.datePicker
    }
}