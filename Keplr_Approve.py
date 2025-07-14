import pyautogui
import time

lit = ['sign_click.png', 'confirm.png', 'approve_button.png']
CONFIDENCE_LEVEL = 0.8
CHECK_INTERVAL = 0.8  
RUN_DURATION = None 

def find_and_click_approve(image_path, confidence):
    try:
        button_location = pyautogui.locateOnScreen(image_path, confidence=confidence)
        if button_location:
            print(f"Found '{image_path}' at: {button_location}")
            button_center = pyautogui.center(button_location)
            pyautogui.click(button_center)
            print(f"Clicked on '{image_path}'.")
            return True
        return False
    except pyautogui.ImageNotFoundException:
        return False
    except Exception as e:
        print(f"An error occurred with {image_path}: {e}")
        return False

if __name__ == "__main__":
    print("Keplr Approve Clicker Script started.")
    print(f"Looking for any of {lit} every {CHECK_INTERVAL} seconds.")
    if RUN_DURATION is not None:
        print(f"Script will run for approximately {RUN_DURATION} seconds.")
    else:
        print("Script will run indefinitely until manually stopped (Press Ctrl+C).")

    start_time = time.time()

    try:
        while RUN_DURATION is None or (time.time() - start_time) < RUN_DURATION:
            for APPROVE_BUTTON_IMAGE in lit:
                found = find_and_click_approve(APPROVE_BUTTON_IMAGE, CONFIDENCE_LEVEL)
                if found:
                    time.sleep(1)
                    break 
            time.sleep(CHECK_INTERVAL)

    except KeyboardInterrupt:
        print("\nScript stopped manually by user.")
    except Exception as e:
        print(f"\nAn unexpected error occurred during execution: {e}")
    finally:
        print("Keplr Approve Clicker Script finished.")



