using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Configurations
{
    public class StudentSkillConfiguration : IEntityTypeConfiguration<StudentSkill>
    {
        public void Configure(EntityTypeBuilder<StudentSkill> builder)
        {
            builder.ToTable("StudentSkills");

            builder.HasKey(ss => ss.Id);

            builder.HasOne(ss => ss.StudentProfile)
                   .WithMany(s => s.StudentSkills)
                   .HasForeignKey(ss => ss.StudentProfileId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ss => ss.Skill)
                   .WithMany(s => s.StudentSkills)
                   .HasForeignKey(ss => ss.SkillId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(ss => new { ss.StudentProfileId, ss.SkillId })
                   .IsUnique();
        }
    }
}
