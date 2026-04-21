import puppeteer from "puppeteer";

// Define viewports for different device types
const VIEWPORTS = {
  pc: 1920,
  tab: 991,
  mob: 375,
};

async function takeScreenshot({ url, outputPath, device, viewport }){
  if(!url) {
    throw new Error('Invalid URL');
  }

  let width;

  if (viewport && viewport.width) {
    width = viewport.width;
  } else if (device && VIEWPORTS[device]) {
    width = VIEWPORTS[device];
  } else {
    throw new Error("Invalid viewport or device");
  }
  
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`Viewport width: ${width}px`);
    
    await page.setViewport({ 
      width,
      height: 1380, // initial viewport (fullPage will override height)
      deviceScaleFactor: 1,
    });

    console.log("Opening:", url);

    await page.goto(url, { 
      waitUntil: 'networkidle0'
    });

    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    await browser.close();

    return outputPath;
  }
  catch (error) {
    throw new Error(`Failed to take screenshot: ${error.message}`);
  }
}

export default takeScreenshot;