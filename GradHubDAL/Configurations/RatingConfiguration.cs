using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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

            builder.HasCheckConstraint("CK_Ratings_Value", "[Value] >= 1 AND [Value] <= 5");

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