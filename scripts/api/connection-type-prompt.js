import fs from 'fs';
import inquirer from 'inquirer';
import { promisify } from 'util';
import { questionPushAPIscripts } from './prompt-questions.js';
import { selectedOptionOutcome } from './selected-option-outcome.js';
import { createNewFileOrOverwriteExistingFileContent, npmRunPackageJsonScript } from '../shared/js/helper-functions.js';
import { user_info } from './save-user-info.js';

const access = promisify(fs.access);

// TODO: console.log and movement of console.log related code from the templates into this scripts package

const connectionSetupTypePrompt = async (templateName, pathToCheck) => {
  // return all files in the path you want to check
  const dirFiles = fs.readdirSync(pathToCheck, (files) => files);

  let dbServerFileNames, ext;

  templateName === 'ts' ? ext = '.ts' : ext = '.js';

  dbServerFileNames = {
    atlas: [`db.atlas.connect${ext}`, `server.atlas${ext}`],
    local: [`db.local.connect${ext}`, `server.local${ext}`]
  }

  // Check for a pair of db file & server file (for atlas and local)
  const atlasSetOfConnectionFiles = dbServerFileNames.atlas.every(element => dirFiles.includes(element));
  const localSetOfConnectionFiles = dbServerFileNames.local.every(element => dirFiles.includes(element));

  // Check that at least one of the pairs exists (for atlas and local)
  const atleastOneSetOfAtlasConnectionFileExists = dbServerFileNames.atlas.some(element => dirFiles.includes(element));
  const atleastOneSetOfLocalConnectionFileExists = dbServerFileNames.local.some(element => dirFiles.includes(element));

  // More pair checks (for atlas and/or local)
  const noCompleteSetOfAtlasOrLocalConnectionFiles = !atlasSetOfConnectionFiles || !localSetOfConnectionFiles;
  const noOneFileFromPairExists = !atleastOneSetOfAtlasConnectionFileExists && !atleastOneSetOfLocalConnectionFileExists;
  const oneFileFromPairExists = atleastOneSetOfAtlasConnectionFileExists || atleastOneSetOfLocalConnectionFileExists;

  const promptOption = {
    switchToAtlas: 'Switch to atlas connection',
    switchToLocal: 'Switch to local connection',
    ignorePrompt: 'Ignore prompt',
    installAtlasConnection: 'Atlas connection',
    installLocalConnection: 'Local connection',
    continueWithBoth: 'Continue using both (not recommended)',
  };

  const userChoice = {
    atlas: [promptOption.switchToLocal, promptOption.ignorePrompt],
    local: [promptOption.switchToAtlas, promptOption.ignorePrompt],
    installNew: [promptOption.installAtlasConnection, promptOption.installLocalConnection],
    switchToOneOrContinueWithBoth: [promptOption.installAtlasConnection, promptOption.installLocalConnection, promptOption.continueWithBoth]
  };

  const promptsUserResponseAndOutcomes = async () => {
    const connectionQuestions = [];
    const questionPushArgs = { connectionQuestions, atlasSetOfConnectionFiles, localSetOfConnectionFiles, userChoice, noCompleteSetOfAtlasOrLocalConnectionFiles, noOneFileFromPairExists, oneFileFromPairExists };
    questionPushAPIscripts(questionPushArgs);
    const connectionNameAnswers = await inquirer.prompt(connectionQuestions);
    const selectedOptionArgs = { templateName, connectionNameAnswers, promptOption, pathToCheck, dbServerFileNames, atlasSetOfConnectionFiles, localSetOfConnectionFiles };
    selectedOptionOutcome(selectedOptionArgs);
  }

  promptsUserResponseAndOutcomes();

  
  
  // user_info.firstTimer ? await promptsUserResponseAndOutcomes() : null;

  // const content = 'const user_info = {\n  firstTimer: false,\n}\n\nexport { user_info };';

  // // TODO: change this targetDirectory path to node_modules path? (when testing published package)
  // createNewFileOrOverwriteExistingFileContent({ 
  //   targetDirectory: '../../node-mongo-scripts/scripts/api/', 
  //   filePathName: 'save-user-info.js', 
  //   content 
  // });



  // =======================================================================
  // const noCompleteSetOfAtlasOrLocalConnectionFiles = !atlasSetOfConnectionFiles || !localSetOfConnectionFiles;
  // const oneFileFromPairExists = atleastOneSetOfAtlasConnectionFileExists || atleastOneSetOfLocalConnectionFileExists;
  // const noOneFileFromPairExists = !atleastOneSetOfAtlasConnectionFileExists || !atleastOneSetOfLocalConnectionFileExists;

  // const dev = {
  //   isFirstTimer: devIsFirstimer,
  //   // hasNoConnectionFile: noOneFileFromPairExists && noCompleteSetOfAtlasOrLocalConnectionFiles,
  //   // hasNoCompleteConnectionFilesPair: noCompleteSetOfAtlasOrLocalConnectionFiles,
  //   // hasAllConnectionFilesPair: atlasSetOfConnectionFiles && localSetOfConnectionFiles,
  // };

  // console.log(dev);
  // const devNeedsPrompt = dev.isFirstTimer /*|| dev.hasNoConnectionFile || dev.hasNoCompleteConnectionFilesPair || dev.hasAllConnectionFilesPair*/;
  // devNeedsPrompt ? promptsUserResponseAndOutcomes() : null;
  // =======================================================================

  // promptsUserResponseAndOutcomes();
}

export const chooseNodeMongoApiDBServer = async (pathToCheck, templateName) => {
  try {
    await access(pathToCheck, fs.constants.R_OK);
    connectionSetupTypePrompt(templateName, pathToCheck);
  } catch(err) {
    console.log(`\nPath or directory '${pathToCheck}' does not exist. Enter correct path as parameter/argument in the chooseNodeMongoApiDBServer() method\n`);
  }

  // npmRunPackageJsonScript({ script: 'dev:auto', currentWorkingDir: './'});
}
