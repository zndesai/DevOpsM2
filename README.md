## Project Milestone 2

### Team Members :
    1) Rutvij Mehta (rmehta4)
    2) Rushi Bhatt (rbhatt)
    3) Vignesh Nandakumar (vnandak)
    4) Zankruti Desai (zndesai)
    
### Link to Screencasts


###
   1) Test suites, coverage and test results
   video Link : [[ https://youtu.be/AreuWKDZQcY ]]
   
        iTrust: Build test explained in the above video and the test cases are covered.
                We used jacoco coverage report for reporting coverage of the code.
   
   2) Test case fuzzer and 5) BONUS: Detect 400+ useless tests
   Video Link: [[ https://youtu.be/kRYjDCmBeBo ]]
   
   Image : ![uselesstests](https://media.github.ncsu.edu/user/5949/files/d74dc364-b929-11e7-9e1c-4d634af9eca1)

       Fuzzer has been created for the post commit hook and the file will be reverted back to its head state after every              fuzzing operation. Commit will trigger testcases in iTrust-fuzzer.
  
   3) Uselesss test detector (at least 100 found)
  Video Link : [[ https://youtu.be/kRYjDCmBeBo ]]
  
      The java useless test cases has been deployed which calculates useless testcases more than 900. 
  
   4) Analysis and build failure
   Video Link : [[ https://youtu.be/84DRihchBXQ ]]
   
   Image : ![checkbox_io](https://media.github.ncsu.edu/user/5949/files/aab04f84-b929-11e7-8eb1-5a0b2cdd1c2b)
   
        Checkbox.io analysis and build failure has been created and it takes care of following cases. 
            Big O > 3
            Max Function length > 120
            More than one *Sync method call

### Contribution :

    1)  Post Commithook and ansible scripts  : Rutvij Mehta
    2)  Job configurations and fuzzer : Rushi Bhatt
    3)  fuzzer , uselesstest and test configuration : Vignesh Nandakumar
    4)  Checkbox analysis and jacoco coverages : Zankruti Desai
