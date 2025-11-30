'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { CVVersionContent, CVWorkExperienceEntry, CVSkillCategory } from '@/services/cv/cvVersion.types';
import type { CompanyResearch } from '@/services/ai/gemini.service';
import type { JobInputData } from './JobPostingInput';

interface GeneratedContentPreviewProps {
  originalContent: CVVersionContent;
  generatedContent: CVVersionContent;
  companyResearch: CompanyResearch;
  jobInputData?: JobInputData;
  onSave: (name: string, content: CVVersionContent) => Promise<void>;
  isSaving: boolean;
}

const GeneratedContentPreview = ({
  originalContent,
  generatedContent,
  companyResearch,
  jobInputData,
  onSave,
  isSaving,
}: GeneratedContentPreviewProps) => {
  const [editedContent, setEditedContent] = useState<CVVersionContent>(generatedContent);
  // Prefer user-provided values over AI-extracted values for the default name
  const companyName = jobInputData?.company || companyResearch.company.name;
  const jobTitle = jobInputData?.jobTitle || companyResearch.role.title;
  const [versionName, setVersionName] = useState(
    companyName ? `${companyName} - ${jobTitle}` : jobTitle
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await onSave(versionName, editedContent);
  };

  // Helper functions for editing arrays
  const updateWorkExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const workExperience = [...(editedContent.workExperience || [])];
    workExperience[expIndex] = {
      ...workExperience[expIndex],
      bullets: workExperience[expIndex].bullets.map((b, i) => (i === bulletIndex ? value : b)),
    };
    setEditedContent({ ...editedContent, workExperience });
  };

  const addWorkExperienceBullet = (expIndex: number) => {
    const workExperience = [...(editedContent.workExperience || [])];
    workExperience[expIndex] = {
      ...workExperience[expIndex],
      bullets: [...workExperience[expIndex].bullets, ''],
    };
    setEditedContent({ ...editedContent, workExperience });
  };

  const removeWorkExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const workExperience = [...(editedContent.workExperience || [])];
    workExperience[expIndex] = {
      ...workExperience[expIndex],
      bullets: workExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex),
    };
    setEditedContent({ ...editedContent, workExperience });
  };

  const updateSkill = (catIndex: number, skillIndex: number, value: string) => {
    const skills = [...(editedContent.skills || [])];
    skills[catIndex] = {
      ...skills[catIndex],
      skills: skills[catIndex].skills.map((s, i) => (i === skillIndex ? value : s)),
    };
    setEditedContent({ ...editedContent, skills });
  };

  const addSkill = (catIndex: number) => {
    const skills = [...(editedContent.skills || [])];
    skills[catIndex] = {
      ...skills[catIndex],
      skills: [...skills[catIndex].skills, ''],
    };
    setEditedContent({ ...editedContent, skills });
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    const skills = [...(editedContent.skills || [])];
    skills[catIndex] = {
      ...skills[catIndex],
      skills: skills[catIndex].skills.filter((_, i) => i !== skillIndex),
    };
    setEditedContent({ ...editedContent, skills });
  };

  const updateKeyAchievement = (index: number, value: string) => {
    const keyAchievements = [...(editedContent.keyAchievements || [])];
    keyAchievements[index] = value;
    setEditedContent({ ...editedContent, keyAchievements });
  };

  const addKeyAchievement = () => {
    setEditedContent({
      ...editedContent,
      keyAchievements: [...(editedContent.keyAchievements || []), ''],
    });
  };

  const removeKeyAchievement = (index: number) => {
    setEditedContent({
      ...editedContent,
      keyAchievements: (editedContent.keyAchievements || []).filter((_, i) => i !== index),
    });
  };

  const ContentComparison = ({
    label,
    original,
    field,
  }: {
    label: string;
    original: string;
    field: 'tagline' | 'profile' | 'slogan' | 'education';
  }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary">
            Original
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {original || '(empty)'}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 'bold' }}>
            Generated (AI)
          </Typography>
          {isEditing ? (
            <TextField
              multiline
              fullWidth
              value={(editedContent[field] as string) || ''}
              onChange={(e) => setEditedContent({ ...editedContent, [field]: e.target.value })}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {(editedContent[field] as string) || '(empty)'}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Alert severity="success">
        Successfully analyzed {companyResearch.company.name} and generated customized content!
      </Alert>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Company Insights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Industry:</strong> {companyResearch.company.industry}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>What they value:</strong> {companyResearch.insights.whatTheyValue}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Suggested tone:</strong> {companyResearch.insights.toneGuidance}
        </Typography>
      </Paper>

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Content Comparison</Typography>
        <Button
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          variant="contained"
          color={isEditing ? 'primary' : 'inherit'}
          size="small"
        >
          {isEditing ? 'Done Editing' : 'Edit Generated'}
        </Button>
      </Box>

      <ContentComparison label="Tagline" original={originalContent.tagline} field="tagline" />

      <ContentComparison
        label="Profile Summary"
        original={originalContent.profile}
        field="profile"
      />

      <ContentComparison label="Slogan" original={originalContent.slogan || ''} field="slogan" />

      <Divider />

      {/* Work Experience Section */}
      {editedContent.workExperience && editedContent.workExperience.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Work Experience
          </Typography>
          {editedContent.workExperience.map((exp, expIndex) => (
            <Accordion key={expIndex} defaultExpanded={expIndex === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} | {exp.period}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <ListItem
                      key={bulletIndex}
                      secondaryAction={
                        isEditing && (
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => removeWorkExperienceBullet(expIndex, bulletIndex)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )
                      }
                    >
                      {isEditing ? (
                        <TextField
                          fullWidth
                          multiline
                          size="small"
                          value={bullet}
                          onChange={(e) =>
                            updateWorkExperienceBullet(expIndex, bulletIndex, e.target.value)
                          }
                        />
                      ) : (
                        <ListItemText primary={`• ${bullet}`} />
                      )}
                    </ListItem>
                  ))}
                </List>
                {isEditing && (
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addWorkExperienceBullet(expIndex)}
                  >
                    Add Bullet
                  </Button>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Skills Section */}
      {editedContent.skills && editedContent.skills.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          {editedContent.skills.map((category, catIndex) => (
            <Box key={catIndex} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {category.category}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {category.skills.map((skill, skillIndex) =>
                  isEditing ? (
                    <Box key={skillIndex} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField
                        size="small"
                        value={skill}
                        onChange={(e) => updateSkill(catIndex, skillIndex, e.target.value)}
                        sx={{ width: 150 }}
                      />
                      <IconButton size="small" onClick={() => removeSkill(catIndex, skillIndex)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Chip key={skillIndex} label={skill} size="small" />
                  )
                )}
                {isEditing && (
                  <Button size="small" startIcon={<AddIcon />} onClick={() => addSkill(catIndex)}>
                    Add
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Key Achievements Section */}
      {editedContent.keyAchievements && editedContent.keyAchievements.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Key Achievements
          </Typography>
          <List dense>
            {editedContent.keyAchievements.map((achievement, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  isEditing && (
                    <IconButton edge="end" size="small" onClick={() => removeKeyAchievement(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    value={achievement}
                    onChange={(e) => updateKeyAchievement(index, e.target.value)}
                  />
                ) : (
                  <ListItemText primary={`• ${achievement}`} />
                )}
              </ListItem>
            ))}
          </List>
          {isEditing && (
            <Button size="small" startIcon={<AddIcon />} onClick={addKeyAchievement}>
              Add Achievement
            </Button>
          )}
        </Box>
      )}

      {/* Education Section */}
      {editedContent.education && (
        <ContentComparison
          label="Education"
          original={originalContent.education || ''}
          field="education"
        />
      )}

      <Divider />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Version Name"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!versionName.trim() || isSaving}
          startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSaving ? 'Saving...' : 'Save Version'}
        </Button>
      </Box>
    </Box>
  );
};

export default GeneratedContentPreview;
