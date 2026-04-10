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
    public class CompanyProfileConfiguration : IEntityTypeConfiguration<CompanyProfile>
    {
        public void Configure(EntityTypeBuilder<CompanyProfile> builder)
        {
            builder.ToTable("CompanyProfiles");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.CompanyName)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(c => c.Description)
                   .HasMaxLength(1000);

            builder.Property(c => c.Industry)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(c => c.WebsiteLink)
                   .HasMaxLength(300);

            builder.Property(c => c.LinkedInLink)
                   .HasMaxLength(300);

            builder.Property(c => c.WhatsAppNumber)
                   .HasMaxLength(20);

            builder.Property(c => c.ContactEmail)
                   .HasMaxLength(150);

            builder.Property(c => c.VerificationStatus)
                   .IsRequired()
                   .HasMaxLength(20)
                   .HasDefaultValue("Pending");

            builder.Property(c => c.IsVerified)
                   .HasDefaultValue(false);

            builder.Property(c => c.AverageRating)
                   .HasColumnType("decimal(3,2)")
                   .HasDefaultValue(0);

            builder.Property(c => c.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(c => c.User)
                   .WithOne(u => u.CompanyProfile)
                   .HasForeignKey<CompanyProfile>(c => c.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
