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
    public class StudentProfileConfiguration : IEntityTypeConfiguration<StudentProfile>
    {
        public void Configure(EntityTypeBuilder<StudentProfile> builder)
        {
            builder.ToTable("StudentProfiles");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Field)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(s => s.Bio)
                   .HasMaxLength(1000);

            builder.Property(s => s.CvFilePath)
                   .HasMaxLength(300);

            builder.Property(s => s.PortfolioLink)
                   .HasMaxLength(300);

            builder.Property(s => s.LinkedInLink)
                   .HasMaxLength(300);

            builder.Property(s => s.WhatsAppNumber)
                   .HasMaxLength(20);

            builder.Property(s => s.ContactEmail)
                   .HasMaxLength(150);

            builder.Property(s => s.AverageRating)
                   .HasColumnType("decimal(3,2)")
                   .HasDefaultValue(0);

            builder.Property(s => s.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(s => s.User)
                   .WithOne(u => u.StudentProfile)
                   .HasForeignKey<StudentProfile>(s => s.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
