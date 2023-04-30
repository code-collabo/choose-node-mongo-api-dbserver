export const questionPushAPIscripts = (arg) => {
  const { connectionQuestions, atlasSetOfConnectionFiles, localSetOfConnectionFiles, userChoice, noCompleteSetOfAtlasOrLocalConnectionFiles, noOneFileFromPairExists, oneFileFromPairExists } = arg;
  // console.log(arg);
  const inquiryType = {
    type: 'list',
    name: 'template',
  }

  if (atlasSetOfConnectionFiles && !localSetOfConnectionFiles) {
    connectionQuestions.push({
      ...inquiryType,
      message: 'Your nodejs API already uses the ATLAS server and db connection type.\n  Which of these actions would you like to take?',
      choices: userChoice.atlas,
      default: userChoice.atlas[0],
    });
  }

  if (localSetOfConnectionFiles && !atlasSetOfConnectionFiles) {
    connectionQuestions.push({
      ...inquiryType,
      message: 'Your nodejs API already uses the LOCAL server and db connection type.\n  Which of these actions would you like to take?',
      choices: userChoice.local,
      default: userChoice.local[0],
    });
  }

  if (atlasSetOfConnectionFiles && localSetOfConnectionFiles) {
    connectionQuestions.push({
      ...inquiryType,
      message: 'Your nodejs API has both ATLAS and LOCAL server and db connection type (which is not recommended because of the confusion that comes with having both connection types). Choose one of the connection types below to continue:',
      choices: [...userChoice.switchToOneOrContinueWithBoth],
      default: userChoice.switchToOneOrContinueWithBoth[0],
    });
  }

  if (noOneFileFromPairExists && noCompleteSetOfAtlasOrLocalConnectionFiles) {
    connectionQuestions.push({
      ...inquiryType,
      message: 'Your nodejs API does not have the needed db and server connection files. This operation will install the connection files in the src/ folder. Choose one of the connection types below to continue:',
      choices: userChoice.installNew,
      default: userChoice.installNew[0],
    });
  }

  if (oneFileFromPairExists && noCompleteSetOfAtlasOrLocalConnectionFiles) {
    connectionQuestions.push({
      ...inquiryType,
      message: 'Your nodejs API does not have a complete set of db and server connection files. This operation will install a complete set in the src/ folder. Choose one of the connection types below to continue: ',
      choices: userChoice.installNew,
      default: userChoice.installNew[0],
    });
  }
}