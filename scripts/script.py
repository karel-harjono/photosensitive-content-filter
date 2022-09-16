import cv2
import matplotlib.pyplot as plt
import numpy as np

def analyze_video(path):
  cap = cv2.VideoCapture(path)
  # Check if camera opened successfully
  if (cap.isOpened()== False): 
    print("Error opening video stream or file")

  timestamp = 0
  intensity = []
  # Read until video is completed
  while(cap.isOpened()):
    # Capture frame-by-frame
    ret, frame = cap.read()
    if ret == True:
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      intensity.append(cv2.mean(gray))
      # Display the resulting frame
      cv2.imshow('Frame',frame)

      # Press Q on keyboard to  exit
      if cv2.waitKey(25) & 0xFF == ord('q'):
        break
      timestamp = timestamp + 1
    # Break the loop
    else: 
      break

  # When everything done, release the video capture object
  cap.release()

  # Closes all the frames
  cv2.destroyAllWindows()
  return [range(1, timestamp+1), intensity]

# print(x)
# print(y)
def show(x, y):
  fig, ax = plt.subplots()
  ax.plot(x, y)
  ax.set_xlabel('timestamp')
  ax.set_ylabel('intensity')
  plt.show()

x, y = analyze_video('videos/Color Test Monitor ABC.mp4')
show(x ,y)
