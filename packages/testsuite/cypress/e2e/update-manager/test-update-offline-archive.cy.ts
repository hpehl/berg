describe("TESTS: Update Manager => Updates => Offline using archive", () => {
  let managementEndpoint: string;
  let timeout_time = 30000 

  const address = ["update-manager", "updates"];
  const zip_file = Cypress.env("UPDATE_ZIP")
  const artifactToBeUpdated = "com.amazonaws:aws-java-sdk-kms"

  before(() => {
    cy.startWildflyContainer().then((result) => {
      managementEndpoint = result as string;
    });
  });

  after(() => {
    cy.task("stop:containers");
  });
  
  it("Ofline update from zip", () => {
    cy.navigateToUpdateManagerPage(managementEndpoint, address);
    cy.get("#update-manager-update-add-actions").click();
    cy.get("#update-manager-update-offline").click();
    cy.get("input#upload-file-input").selectFile(zip_file,
      {
        action: "drag-drop",
        force: true,
      }
    );
    cy.confirmNextInWizard();
    cy.get("#update-manager-list-updates", { timeout: timeout_time })
    .should("be.visible").contains(artifactToBeUpdated);
    cy.confirmNextInWizard();
    cy.get("div.blank-slate-pf.wizard-pf-complete", { timeout: timeout_time })
    .contains("Server candidate prepared");
    cy.confirmNextInWizard();
    cy.get("div.blank-slate-pf.wizard-pf-complete", { timeout: timeout_time })
    .contains("Updates applied")
    cy.confirmFinishInWizard();
    // After the update there should be visible 3 items in history
    cy.get("#update-manager-update > ul > li").should('have.length', 3)
  });
});
