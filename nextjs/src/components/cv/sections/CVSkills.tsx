import type { CVSkillCategory } from '../types/CVTypes';

interface CVSkillsProps {
  categories: CVSkillCategory[];
}

const CVSkills = ({ categories }: CVSkillsProps) => {
  return (
    <div className="cv-section cv-skills">
      <h2>Skills</h2>
      {categories.map((category, index) => (
        <div key={index} className="cv-skills-category">
          <div className="cv-skills-category-name">{category.name}</div>
          <div className="cv-skills-list">
            {category.skills.map((skill, i) => (
              <span key={i} className="cv-skill-chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CVSkills;
