HOW TO RUN THE VOTING SYSTEM

1. Open the file \<your file path>\CS_Product_JohnsonAmal_21263175\Ireland_Votes\ireland-voting-system\.env and assign your MySQL root password to DB_PASS.

2. Execute all queries from the file \<your file path>\CS_Product_JohnsonAmal_21263175\Ireland_Votes\ireland-voting-system\backend\ireland_voting_system.sql in your MySQL workbench.

On your terminal:

3. Run the command : npm install --legacy-peer-deps

4. If you do not have ganache installed on your device, run the command: npm install -g ganache

5. Once the installation is complete, run ganache 

6. In the .env file, assign one of the private keys to GANACHE_PRIVATE_KEY.

7. In the terminal, change working directory to \<your file path>\CS_Product_JohnsonAmal_21263175\Ireland_Votes\ireland-voting-system

8. Install nodemon on your device through the following commands: 
   rm -rf node_modules package-lock.json 
   npm install --global --production windows-build-tools

9. Run the command: npm rebuild canvas

10. To compile the blockchain, run: node backend/scripts/compileVoting.js

11. To deploy the blockchain, run: node backend/deployVotingContract.js

12. Run the command: npm run dev. The voting website should now open in your browser. 
