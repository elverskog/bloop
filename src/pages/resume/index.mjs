async function resumeIndex() {

  const resume = (await import(`${__basedir}/src/components/resume/resume.mjs`)).default;

  return await formatComponent(resume);

}

export default resumeIndex;