import { LandingPage } from "../../pages/LandingPage";
import { CrashPage } from "../../pages/CrashPage";
import { DicePage } from "../../pages/DicePage";
import { HiloPage } from "../../pages/HiloPage";
import { RoulettePage } from "../../pages/RoulettePage";
import { my_test, expect } from "@/helpers/fixtures";

my_test.describe("Gamdom UI Test Orignals @ui", () => {
  my_test("test Crash Game Load", async ({ authenticatedPage }) => {
    const landingPage = new LandingPage(authenticatedPage);
    await landingPage.navigate();
    await landingPage.mainMenu.click();
    await landingPage.originalsButton.click();
    await expect(landingPage.crashButton).toBeVisible();
    await landingPage.crashButton.click();
    const crashPage = new CrashPage(authenticatedPage);
    await crashPage.loaded();
    await expect(crashPage.crashCanvas).toBeVisible();
  });

  my_test("test Dice Game Load", async ({ authenticatedPage }) => {
    const landingPage = new LandingPage(authenticatedPage);
    await landingPage.navigate();
    await landingPage.mainMenu.click();
    await landingPage.originalsButton.click();
    await expect(landingPage.diceButton).toBeVisible();
    await landingPage.diceButton.click();
    const dicePage = new DicePage(authenticatedPage);
    await dicePage.loaded();
    await expect(dicePage.rollDiceBtn).toBeVisible();
    await expect(dicePage.resultWrapper).toBeVisible();
  });

  my_test("test Roulette Game Load", async ({ authenticatedPage }) => {
    const landingPage = new LandingPage(authenticatedPage);
    await landingPage.navigate();
    await landingPage.mainMenu.click();
    await landingPage.originalsButton.click();
    await expect(landingPage.rouletteButton).toBeVisible();
    await landingPage.rouletteButton.click();
    const roulettePage = new RoulettePage(authenticatedPage);
    await roulettePage.loaded();
    await expect(roulettePage.rouletteCanvas).toBeVisible();
  });

  my_test("test Hilo Game Load", async ({ authenticatedPage }) => {
    const landingPage = new LandingPage(authenticatedPage);
    await landingPage.navigate();
    await landingPage.mainMenu.click();
    await landingPage.originalsButton.click();
    await expect(landingPage.hiloButton).toBeVisible();
    await landingPage.hiloButton.click();
    const hiloPage = new HiloPage(authenticatedPage);
    await hiloPage.loaded();
    await expect(hiloPage.hiloHiLoBetButtons).toBeVisible();
  });
});
