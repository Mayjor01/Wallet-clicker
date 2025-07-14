let isPaused = false;
let currentTimeout = null;
let currentAttempt = 0; // Track attempts globally for a cycle
const findButtonByText = (text) => {
  const buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find(button => button.textContent.trim().includes(text));
};

const checkInterval = 750; // Consistent check interval

const startSequence = () => {
    console.log('Starting/Restarting the click sequence loop.');
    clickTransferReady();
}


const clickTransferReady = () => {
  if (isPaused) {
    console.log("Sequence is paused. Waiting to resume...");
    currentTimeout = setTimeout(clickTransferReady, 100); // Recheck shortly if still paused
    return;
  }

  currentAttempt = 0; // Reset attempts for this stage
  const check = () => {
    if (isPaused) {
      console.log("Sequence is paused. Waiting to resume...");
      currentTimeout = setTimeout(check, 100); // Recheck shortly if still paused
      return;
    }

    console.log(`Checking for "Transfer ready" button, Attempt ${currentAttempt + 1}`);
    const transferReadyButton = findButtonByText('Transfer ready');

    if (transferReadyButton) {
      const computedStyle = window.getComputedStyle(transferReadyButton);
      if (computedStyle.pointerEvents !== 'none' && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none' && !transferReadyButton.disabled) {
        transferReadyButton.click();
        console.log('Clicked the "Transfer ready" button. Waiting 1 second...');
        currentTimeout = setTimeout(checkForSubmitButton, 1000); // Wait 1 second before checking for Submit
      } else {
        console.warn('"Transfer ready" button found but not clickable. Trying again...');
        currentAttempt++;
        currentTimeout = setTimeout(check, checkInterval);
      }
    } else {
      console.log('"Transfer ready" button not found. Trying again...');
      currentAttempt++;
      currentTimeout = setTimeout(check, checkInterval);
    }
  };
  check(); // Start checking for Transfer ready
};

const checkForSubmitButton = () => {
  if (isPaused) {
    console.log("Sequence is paused. Waiting to resume...");
    currentTimeout = setTimeout(checkForSubmitButton, 100); // Recheck shortly if still paused
    return;
  }

  currentAttempt = 0; // Reset attempts for this stage
  const check = () => {
    if (isPaused) {
      console.log("Sequence is paused. Waiting to resume...");
      currentTimeout = setTimeout(check, 100); // Recheck shortly if still paused
      return;
    }

    console.log(`Checking for "Submit" button, Attempt ${currentAttempt + 1}`);
    const submitButton = findButtonByText('Submit');

    if (submitButton) {
      const computedStyle = window.getComputedStyle(submitButton);
      if (computedStyle.pointerEvents !== 'none' && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none' && !submitButton.disabled) {
        submitButton.click();
        console.log('Clicked the "Submit" button. Waiting 7 seconds...'); // Increased wait for potential loading
        currentTimeout = setTimeout(checkForNewTransferButton, 7000); // Wait 7 seconds before checking for New transfer (considering transaction time)
      } else {
         console.warn('Found "Submit" button but it is not clickable. Trying again...');
          currentAttempt++;
          currentTimeout = setTimeout(check, checkInterval);
      }
    } else {
      console.log('"Submit" button not found. Trying again...');
      currentAttempt++;
      currentTimeout = setTimeout(check, checkInterval);
    }
  };
  check(); // Start checking for Submit
};

const checkForNewTransferButton = () => {
  if (isPaused) {
    console.log("Sequence is paused. Waiting to resume...");
    currentTimeout = setTimeout(checkForNewTransferButton, 100); // Recheck shortly if still paused
    return;
  }

  currentAttempt = 0; // Reset attempts for this stage
  const check = () => {
     if (isPaused) {
      console.log("Sequence is paused. Waiting to resume...");
      currentTimeout = setTimeout(check, 100); // Recheck shortly if still paused
      return;
    }

    console.log(`Checking for "New transfer" button, Attempt ${currentAttempt + 1}`);
    const newTransferButton = findButtonByText('New transfer');
    const cancelButton = findButtonByText('Cancel'); // Check for Cancel button

    if (newTransferButton) {
      const computedStyle = window.getComputedStyle(newTransferButton);
      if (computedStyle.pointerEvents !== 'none' && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none' && !newTransferButton.disabled) {
        newTransferButton.click();
        console.log('Clicked the "New transfer" button. Waiting 4 seconds before looping back...'); // Increased wait for potential loading
        currentTimeout = setTimeout(clickTransferReady, 4000); // Wait 4 seconds then loop back to Transfer ready
      } else {
         console.warn('Found "New transfer" button but it is not clickable. Trying again...');
         currentAttempt++;
         currentTimeout = setTimeout(check, checkInterval);
      }
    } else if (cancelButton) { // If New Transfer not found, check for Cancel
        const computedStyle = window.getComputedStyle(cancelButton);
        if (computedStyle.pointerEvents !== 'none' && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none' && !cancelButton.disabled) {
            cancelButton.click();
            console.log('Clicked "Cancel" button due to error. Restarting sequence...');
            currentTimeout = setTimeout(clickTransferReady, 2000); // Wait before restarting
        } else {
            console.warn('Found "Cancel" button but it is not clickable. Trying again...');
            currentAttempt++;
            currentTimeout = setTimeout(check, checkInterval);
        }
    }
    else {
      console.log('"New transfer" or "Cancel" button not found. Trying again...');
      currentAttempt++;
      currentTimeout = setTimeout(check, checkInterval);
    }
  };
  check(); // Start checking for New transfer and Cancel
};

// Add keydown listener (ensure only one listener is added if running multiple times)
// Check if the listener already exists to prevent duplicates
if (!window.__clickSequenceKeyListener) {
  window.__clickSequenceKeyListener = (event) => {
    if (event.key === 'q' || event.key === 'Q') {
      isPaused = !isPaused;
      if (isPaused) {
        console.log("--- Click sequence PAUSED --- Press 'q' to resume.");
        // Optionally clear timeout when paused to stop checks immediately
        clearTimeout(currentTimeout);
      } else {
        console.log("--- Click sequence RESUMED ---");
        // Restart the sequence check from the last point or a sensible start
        // Simple restart from the beginning for this script's flow
        startSequence();
      }
    }
  };
  document.addEventListener('keydown', window.__clickSequenceKeyListener);
  console.log("Keyboard listener for 'q' key added.");
} else {
    console.log("Keyboard listener for 'q' key already exists.");
}


// Start the sequence
startSequence();