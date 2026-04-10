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
    public class RatingConfiguration : IEntityTypeConfiguration<Rating>
    {
        public void Configure(EntityTypeBuilder<Rating> builder)
        {
            builder.ToTable("Ratings");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Value)
                   .IsRequired();

            builder.Property(r => r.Comment)
                   .HasMaxLength(500);

            builder.Property(r => r.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(r => r.FromUser)
                   .WithMany(u => u.RatingsGiven)
                   .HasForeignKey(r => r.FromUserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.ToUser)
                   .WithMany(u => u.RatingsReceived)
                   .HasForeignKey(r => r.ToUserId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
