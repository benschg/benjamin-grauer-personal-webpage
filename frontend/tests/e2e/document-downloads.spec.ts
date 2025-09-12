import { test, expect } from '@playwright/test';

test.describe('Document Downloads', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/working-life');
    await expect(page.locator('main')).toBeVisible();
  });

  test('All three documents are downloadable', async ({ page }) => {
    // Wait for the documents section to load
    await expect(page.locator('text=Documents')).toBeVisible();

    // Look for download links (MUI Button with href renders as <a> tag)
    const downloadLinks = page.locator('a:has-text("Download PDF")');
    await expect(downloadLinks).toHaveCount(3);

    // Test that all download links have proper structure
    for (let i = 0; i < 3; i++) {
      const link = downloadLinks.nth(i);
      await expect(link).toBeVisible();
      
      // Check that href points to working-life documents folder and is a PDF
      const href = await link.getAttribute('href');
      expect(href).toMatch(/\/working-life\/documents\/.*\.pdf$/);
      
      // Check that download attribute is set with your full name
      const download = await link.getAttribute('download');
      expect(download).toMatch(/^Benjamin_Grauer_(References|Certificates|CV)\.pdf$/);
    }

    // Test document titles are visible (using heading selectors to be specific)
    await expect(page.locator('h5:has-text("References")')).toBeVisible();
    await expect(page.locator('h5:has-text("Certificates")')).toBeVisible();
    await expect(page.locator('h5:has-text("Full CV")')).toBeVisible();
  });

  test('Document files exist and are accessible', async ({ page }) => {
    // Get all download links and extract their URLs dynamically
    await expect(page.locator('text=Documents')).toBeVisible();
    const downloadLinks = page.locator('a:has-text("Download PDF")');
    
    const linkCount = await downloadLinks.count();
    expect(linkCount).toBe(3);

    for (let i = 0; i < linkCount; i++) {
      const link = downloadLinks.nth(i);
      const url = await link.getAttribute('href');
      
      // Use request to check if files exist instead of goto (to avoid download popup)
      const response = await page.request.get(url!);
      
      // Check that the response is successful (200 status)
      expect(response.status()).toBe(200);
      
      // Check that the content type is PDF
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('pdf');
    }
  });

  test('Download links trigger file download with clean filenames', async ({ page }) => {
    // Wait for the documents section to load
    await expect(page.locator('text=Documents')).toBeVisible();

    // Get the first download link dynamically
    const downloadLinks = page.locator('a:has-text("Download PDF")');
    const firstDownloadLink = downloadLinks.first();
    await expect(firstDownloadLink).toBeVisible();
    
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click the download link
    await firstDownloadLink.click();
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Verify the download has filename with your full name
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/^Benjamin_Grauer_(References|Certificates|CV)\.pdf$/);
  });

  test('Document cards display correct information', async ({ page }) => {
    // Wait for the documents section to load
    await expect(page.locator('text=Documents')).toBeVisible();
    const documentsSection = page.locator('text=Documents').locator('..');

    // Check References card
    const referencesCard = documentsSection.locator('.MuiCard-root').filter({ hasText: 'References' });
    await expect(referencesCard).toBeVisible();
    await expect(referencesCard).toContainText('Professional references and recommendations');
    
    // Check Certificates card
    const certificatesCard = documentsSection.locator('.MuiCard-root').filter({ hasText: 'Certificates' });
    await expect(certificatesCard).toBeVisible();
    await expect(certificatesCard).toContainText('Professional certifications and training certificates');
    
    // Check Full CV card
    const cvCard = documentsSection.locator('.MuiCard-root').filter({ hasText: 'Full CV' });
    await expect(cvCard).toBeVisible();
    await expect(cvCard).toContainText('Complete curriculum vitae with detailed work history');
  });

  test('Document cards have proper icons', async ({ page }) => {
    // Wait for the documents section to load
    await expect(page.locator('text=Documents')).toBeVisible();
    const documentsSection = page.locator('text=Documents').locator('..');

    // Check that each document card has an icon (MUI icons render as SVG)
    const documentCards = documentsSection.locator('.MuiCard-root');
    await expect(documentCards).toHaveCount(3);
    
    // Each card should have exactly one main icon (excluding download button icon)
    for (let i = 0; i < 3; i++) {
      const card = documentCards.nth(i);
      const cardContent = card.locator('.MuiCardContent-root');
      const icons = cardContent.locator('svg');
      // Each card should have at least one icon in the card content area
      await expect(icons).toHaveCount(1);
    }
  });

  test('Documents section is properly styled', async ({ page }) => {
    // Wait for the documents section to load
    await expect(page.locator('text=Documents')).toBeVisible();
    const documentsSection = page.locator('text=Documents').locator('..');

    // Check that document cards have hover effects
    const documentCards = documentsSection.locator('.MuiCard-root');
    const firstCard = documentCards.first();
    
    // Hover over the card and check for transform
    await firstCard.hover();
    
    // The card should have some visual feedback on hover
    // (We can't easily test CSS transforms, but we can check that the card is still visible and interactive)
    await expect(firstCard).toBeVisible();
    
    // Check that download links are styled correctly
    const downloadLinks = page.locator('a:has-text("Download PDF")');
    await expect(downloadLinks).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      const link = downloadLinks.nth(i);
      await expect(link).toBeVisible();
      // Check that links have proper href attributes
      const href = await link.getAttribute('href');
      expect(href).toContain('/working-life/documents/');
      expect(href).toContain('.pdf');
    }
  });
});